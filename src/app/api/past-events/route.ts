import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: pastEvents, error } = await supabase
    .from("PastEvent")
    .select("id, slug, title, description, category, date, location, attendanceCount, coverImageUrl, galleryUrls, status")
    .eq("status", "PUBLISHED")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching past events from Supabase:", error);
    return Response.json([], { status: 500 });
  }

  return Response.json(pastEvents || []);
}
