import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const { registrationId } = await params;
  const db = supabase();

  const { data: reg, error } = await db
    .from("Registration")
    .select("id, status, guestName, guestEmail, event:Event(title, location, startsAt), payment:Payment(id, status, amountKes, mpesaReceiptNumber)")
    .eq("id", registrationId)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!reg) {
    return Response.json({ error: "Registration not found" }, { status: 404 });
  }

  return Response.json({
    registrationId: reg.id,
    registrationStatus: reg.status,
    guestName: reg.guestName,
    guestEmail: reg.guestEmail,
    event: reg.event,
    paymentStatus: (reg.payment as any)?.status ?? "NOT_FOUND",
    amountKes: (reg.payment as any)?.amountKes ?? 0,
    mpesaReceiptNumber: (reg.payment as any)?.mpesaReceiptNumber ?? null,
  });
}
