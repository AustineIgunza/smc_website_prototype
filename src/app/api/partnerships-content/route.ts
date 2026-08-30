import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { partnershipsContentSchema } from "@/backend/validators/partnershipsContent";
import { getPartnershipsContent } from "@/lib/partnerships-content";

export async function GET() {
  const content = await getPartnershipsContent();
  return NextResponse.json(content);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = partnershipsContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: content, error } = await supabase
    .from("PartnershipsContent")
    .upsert({
      id: "partnerships",
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content });
}
