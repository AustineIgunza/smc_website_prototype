import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { teamMemberUpdateSchema } from "@/backend/validators/teamMember";
import { generateUniqueTeamSlug } from "@/lib/team-slug";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: member } = await supabase
    .from("TeamMember")
    .select("*")
    .eq("id", id)
    .single();

  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = teamMemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };

  if (parsed.data.role) {
    const newId = await generateUniqueTeamSlug(supabase, parsed.data.role, id);
    if (newId !== id) {
      updateData.id = newId;
    }
  }

  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio ?? "";
  if (parsed.data.quote !== undefined) updateData.quote = parsed.data.quote ?? "";
  if (parsed.data.focus !== undefined) updateData.focus = parsed.data.focus ?? [];
  if (parsed.data.socials !== undefined) updateData.socials = parsed.data.socials ?? [];
  if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl || null;

  const { data: member, error } = await supabase
    .from("TeamMember")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ member });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("TeamMember")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
