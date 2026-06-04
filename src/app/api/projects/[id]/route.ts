import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { projectUpdateSchema } from "@/backend/validators/project";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: project } = await supabase.from("Project").select("*").eq("id", id).single();
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from("Project")
    .update({ ...parsed.data, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ project });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("Project").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
