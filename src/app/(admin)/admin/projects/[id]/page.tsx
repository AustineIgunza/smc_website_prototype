import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const { data: project } = await supabase.from("Project").select("*").eq("id", id).single();
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/projects"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors"
        >
          ← Projects
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide">Edit Project</h1>
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
        <p className="font-body text-cream/25 text-xs mt-1.5">
          {project.category}{project.clientName ? ` · ${project.clientName}` : ""}
        </p>
      </div>
      <EditProjectClient project={project} />
    </div>
  );
}
