import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pastEventSchema } from "@/backend/validators/pastEvent";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pastEvents, error } = await supabase
    .from("PastEvent")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(pastEvents || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = pastEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("PastEvent")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "A past event with this slug already exists" }, { status: 409 });
  }

  const newId = `past-${Date.now()}`;
  const { data: pastEvent, error } = await supabase
    .from("PastEvent")
    .insert({
      id: newId,
      ...parsed.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pastEvent }, { status: 201 });
}
