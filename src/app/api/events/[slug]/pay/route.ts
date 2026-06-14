import { createClient } from "@supabase/supabase-js";
import { rsvpSchema } from "@/backend/validators/rsvp";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, phone } = parsed.data;
  const guestEmail = parsed.data.email.toLowerCase();
  const guestPhone = phone && phone.length > 0 ? phone : null;

  if (!guestPhone) {
    return Response.json(
      { error: "Phone number is required for paid events." },
      { status: 400 }
    );
  }

  // Sanitize phone number to M-Pesa format (2547XXXXXXXX)
  let mpesaPhone = guestPhone.replace(/\D/g, "");
  if (mpesaPhone.startsWith("0")) {
    mpesaPhone = "254" + mpesaPhone.substring(1);
  } else if (mpesaPhone.startsWith("+")) {
    mpesaPhone = mpesaPhone.substring(1);
  } else if (!mpesaPhone.startsWith("254") && mpesaPhone.length === 9) {
    mpesaPhone = "254" + mpesaPhone;
  }

  if (mpesaPhone.length !== 12 || !mpesaPhone.startsWith("254")) {
    return Response.json(
      { error: "Invalid phone number. Must be a valid Kenyan mobile number (e.g. 07XXXXXXXX)." },
      { status: 400 }
    );
  }

  const db = supabase();

  // 1. Fetch Event
  const { data: event } = await db
    .from("Event")
    .select("id, title, status, type, priceKes, capacity, Registration(id, status)")
    .eq("slug", slug)
    .single();

  if (!event || event.status !== "PUBLISHED") {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.type !== "PAID") {
    return Response.json({ error: "This is a free event. Use the standard RSVP flow." }, { status: 400 });
  }

  // 2. Capacity check
  const activeCount = ((event.Registration as { status: string }[] | null) ?? []).filter(
    (r) => r.status !== "CANCELLED",
  ).length;

  if (event.capacity !== null && activeCount >= event.capacity) {
    return Response.json({ error: "Event is full" }, { status: 409 });
  }

  // 3. Check existing registration
  const { data: existing } = await db
    .from("Registration")
    .select("id, status, payment:Payment(id, status)")
    .eq("eventId", event.id)
    .eq("guestEmail", guestEmail)
    .maybeSingle();

  if (existing && existing.status === "CONFIRMED") {
    return Response.json(
      { error: "This email is already registered and confirmed for this event." },
      { status: 409 }
    );
  }

  // We either reuse a reserved registration or create a new one
  let registrationId = existing?.id;
  let paymentId = (existing?.payment as any)?.id;

  if (!registrationId) {
    registrationId = crypto.randomUUID();
    paymentId = crypto.randomUUID();

    // Create reserved registration and pending payment
    const { error: regError } = await db
      .from("Registration")
      .insert({
        id: registrationId,
        eventId: event.id,
        guestName: name,
        guestEmail,
        guestPhone: mpesaPhone,
        status: "RESERVED",
      });

    if (regError) return Response.json({ error: regError.message }, { status: 500 });

    const { error: payError } = await db
      .from("Payment")
      .insert({
        id: paymentId,
        registrationId,
        eventId: event.id,
        amountKes: event.priceKes,
        status: "PENDING",
        provider: "MPESA",
      });

    if (payError) return Response.json({ error: payError.message }, { status: 500 });
  } else {
    // If it exists but is not confirmed, update the user details
    await db
      .from("Registration")
      .update({ guestName: name, guestPhone: mpesaPhone, status: "RESERVED" })
      .eq("id", registrationId);
  }

  // 4. Trigger M-Pesa STK Push
  let checkoutRequestId = `MOCK-${crypto.randomUUID()}`;
  let stkSuccess = false;

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (consumerKey && consumerSecret && passkey && callbackUrl) {
    try {
      // Fetch OAuth Token
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
      const tokenRes = await fetch(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: { Authorization: `Basic ${auth}` },
        }
      );
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (accessToken) {
        // Generate password and timestamp
        const timestamp = new Date()
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, 14); // YYYYMMDDHHmmss
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

        const stkRes = await fetch(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              BusinessShortCode: shortcode,
              Password: password,
              Timestamp: timestamp,
              TransactionType: "CustomerPayBillOnline",
              Amount: event.priceKes,
              PartyA: mpesaPhone,
              PartyB: shortcode,
              PhoneNumber: mpesaPhone,
              CallBackURL: callbackUrl,
              AccountReference: event.title.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "EventPayment",
              TransactionDesc: `RSVP ${event.title.slice(0, 10)}`,
            }),
          }
        );

        const stkData = await stkRes.json();
        if (stkData.CheckoutRequestID) {
          checkoutRequestId = stkData.CheckoutRequestID;
          stkSuccess = true;
        } else {
          console.error("Daraja STK push error response:", stkData);
        }
      }
    } catch (err) {
      console.error("Daraja integration error:", err);
    }
  } else {
    console.warn("M-Pesa credentials not configured. Falling back to local development mock mode.");
  }

  // Update Payment record with the checkoutRequestId
  await db
    .from("Payment")
    .update({
      checkoutRequestId,
      phone: mpesaPhone,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", paymentId);

  return Response.json(
    {
      registrationId,
      paymentId,
      checkoutRequestId,
      stkSuccess,
    },
    { status: 200 }
  );
}
