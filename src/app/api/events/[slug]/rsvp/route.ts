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

  const db = supabase();

  const { data: event } = await db
    .from("Event")
    .select("id, status, type, capacity, registrations(id, status)")
    .eq("slug", slug)
    .single();

  if (!event || event.status !== "PUBLISHED") {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.type !== "FREE") {
    return Response.json({ error: "This is a paid event. Use the payment flow." }, { status: 400 });
  }

  const activeCount = (event.registrations as { status: string }[]).filter(
    (r) => r.status !== "CANCELLED",
  ).length;

  if (event.capacity !== null && activeCount >= event.capacity) {
    return Response.json({ error: "Event is full" }, { status: 409 });
  }

  const { data: existing } = await db
    .from("Registration")
    .select("id, status")
    .eq("eventId", event.id)
    .eq("guestEmail", guestEmail)
    .maybeSingle();

  if (existing && existing.status !== "CANCELLED") {
    return Response.json(
      { error: "This email is already registered for this event." },
      { status: 409 }
    );
  }

  if (existing) {
    const { data: reg, error } = await db
      .from("Registration")
      .update({ guestName: name, guestPhone, status: "CONFIRMED" })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(
      { registration: { id: reg.id, eventId: reg.eventId, status: reg.status } },
      { status: 200 }
    );
  }

  const { data: reg, error } = await db
    .from("Registration")
    .insert({
      id: crypto.randomUUID(),
      eventId: event.id,
      guestName: name,
      guestEmail,
      guestPhone,
      status: "CONFIRMED",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "This email is already registered for this event." },
        { status: 409 }
      );
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(
    { registration: { id: reg.id, eventId: reg.eventId, status: reg.status } },
    { status: 201 }
  );
}
