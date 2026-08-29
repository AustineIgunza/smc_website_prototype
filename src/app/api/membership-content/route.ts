import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { membershipContentSchema } from "@/backend/validators/membershipContent";
import { getMembershipContent } from "@/lib/membership-content";

export async function GET() {
  const content = await getMembershipContent();
  return NextResponse.json(content);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = membershipContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: content, error } = await supabase
    .from("MembershipContent")
    .upsert({
      id: "membership",
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content });
}
