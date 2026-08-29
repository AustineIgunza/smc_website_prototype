import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { teamMemberSchema } from "@/backend/validators/teamMember";
import { generateUniqueTeamSlug } from "@/lib/team-slug";

export async function GET() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("TeamMember")
    .select("*")
    .order("createdAt", { ascending: true });
  return NextResponse.json(members ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const id = await generateUniqueTeamSlug(supabase, parsed.data.role);

  const { data: member, error } = await supabase
    .from("TeamMember")
    .insert({
      id,
      name: parsed.data.name,
      role: parsed.data.role,
      title: parsed.data.title,
      course: parsed.data.course,
      year: parsed.data.year,
      bio: parsed.data.bio ?? "",
      focus: parsed.data.focus ?? [],
      quote: parsed.data.quote ?? "",
      socials: parsed.data.socials ?? [],
      avatarGradient: parsed.data.avatarGradient,
      avatarUrl: parsed.data.avatarUrl || null,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ member }, { status: 201 });
}
