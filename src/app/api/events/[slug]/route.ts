import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = supabase();

  const { data: event } = await db
    .from("Event")
    .select("*, registrations(id, status), partner:Partner(name)")
    .eq("slug", slug)
    .single();

  if (!event || event.status !== "PUBLISHED") {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  const activeCount = (event.registrations as { status: string }[]).filter(
    (r) => r.status !== "CANCELLED",
  ).length;

  return Response.json({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    category: event.category,
    type: event.type,
    priceKes: event.priceKes,
    capacity: event.capacity,
    spotsRemaining: event.capacity != null ? event.capacity - activeCount : null,
    startsAt: event.startsAt,
    location: event.location,
    ownerType: event.ownerType,
    partnerName: (event.partner as { name: string } | null)?.name ?? null,
  });
}
