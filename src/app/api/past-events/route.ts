import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET() {
  const db = supabase();

  const { data: pastEvents, error } = await db
    .from("PastEvent")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching past events from Supabase:", error);
    return Response.json([], { status: 500 });
  }

  return Response.json(pastEvents || []);
}
