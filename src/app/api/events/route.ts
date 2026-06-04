import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET() {
  const db = supabase();

  const { data: events } = await db
    .from("Event")
    .select("*, registrations(id, status)")
    .eq("status", "PUBLISHED")
    .order("startsAt", { ascending: true });

  if (!events) return Response.json([]);

  const mapped = events.map((e) => {
    const activeCount = (e.registrations as { status: string }[]).filter(
      (r) => r.status !== "CANCELLED",
    ).length;
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      description: e.description,
      category: e.category,
      type: e.type,
      priceKes: e.priceKes,
      capacity: e.capacity,
      spotsRemaining: e.capacity != null ? e.capacity - activeCount : null,
      startsAt: e.startsAt,
      location: e.location,
      ownerType: e.ownerType,
    };
  });

  return Response.json(mapped);
}
