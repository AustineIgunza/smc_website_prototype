import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/backend/validators/project";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
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

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  const project = await prisma.project.create({ data: parsed.data });
  return NextResponse.json({ project }, { status: 201 });
}
