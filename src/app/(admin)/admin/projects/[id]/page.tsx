import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/backend/db/prisma";
import EditProjectClient from "./EditProjectClient";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors"
        >
          ← Projects
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="font-display text-2xl font-bold text-cream">Edit Project</h1>
          <span
            className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full ${
              project.status === "PUBLISHED"
                ? "bg-green-500/15 text-green-400"
                : "bg-cream/10 text-cream/40"
            }`}
          >
            {project.status}
          </span>
          {project.featured && (
            <span className="text-amber text-sm">★</span>
          )}
        </div>
        <p className="font-body text-cream/25 text-xs mt-1">
          {project.category}{project.clientName ? ` · ${project.clientName}` : ""}
        </p>
      </div>
      <EditProjectClient project={project} />
    </div>
  );
}
