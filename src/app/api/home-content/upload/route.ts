import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "avatars"; // Reuse the public storage bucket
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const tileId = (formData.get("tileId") as string) || "tile";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPG, PNG, WebP, SVG." },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 400 }
    );
  }

  // Generate a unique file path under home/ folder
  const ext = file.name.split(".").pop() || "jpg";
  const cleanId = tileId.replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  const filePath = `home/${cleanId}-${Date.now()}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl, path: filePath }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await req.json();
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  const { error: deleteError } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (deleteError) {
    console.error("Storage delete error:", deleteError);
    return NextResponse.json(
      { error: `Delete failed: ${deleteError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
