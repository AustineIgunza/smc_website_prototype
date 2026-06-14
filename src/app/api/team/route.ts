import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { teamMemberSchema } from "@/backend/validators/teamMember";

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

  const { data: member, error } = await supabase
    .from("TeamMember")
    .insert({
      id: crypto.randomUUID(),
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ member }, { status: 201 });
}
