import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: events, error } = await supabase
    .from("Event")
    .select("id, slug, title, description, category, type, priceKes, capacity, startsAt, location, ownerType, imageUrl, Registration(id, status)")
    .eq("status", "PUBLISHED")
    .order("startsAt", { ascending: true });

  if (error || !events) return Response.json([]);

  const mapped = events.map((e) => {
    const activeCount = ((e.Registration as { status: string }[] | null) ?? []).filter(
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
      imageUrl: e.imageUrl,
    };
  });

  return Response.json(mapped);
}
