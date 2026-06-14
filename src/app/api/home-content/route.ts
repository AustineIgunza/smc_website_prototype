import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { homeContentSchema } from "@/backend/validators/homeContent";
import { getHomeContent } from "@/lib/home-content";

export async function GET() {
  const content = await getHomeContent();
  return NextResponse.json(content);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  // Full schema (not partial) so admins always save a complete, valid set —
  // the form sends every field on every submit.
  const parsed = homeContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: content, error } = await supabase
    .from("HomeContent")
    .upsert({
      id: "home",
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content });
}
