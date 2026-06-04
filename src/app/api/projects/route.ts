import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/backend/validators/project";

export async function GET() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("Project")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("createdAt", { ascending: false });
  return NextResponse.json(projects ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("Project")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  const { data: project, error } = await supabase
    .from("Project")
    .insert({ id: crypto.randomUUID(), ...parsed.data, updatedAt: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ project }, { status: 201 });
}
