import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { eventUpdateSchema } from "@/backend/validators/event";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = eventUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: event, error } = await supabase
    .from("Event")
    .update({
      ...parsed.data,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");

  return NextResponse.json({ event });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // 1. Delete associated payments and registrations concurrently
  await Promise.all([
    supabase.from("Payment").delete().eq("eventId", id),
    supabase.from("Registration").delete().eq("eventId", id),
  ]);

  // 2. Delete the event itself
  const { error } = await supabase
    .from("Event")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
