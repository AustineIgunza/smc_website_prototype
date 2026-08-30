import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CaseStudyDetail, { type Project } from "@/components/portfolio/CaseStudyDetail";
import { ArrowLeft } from "@/components/icons";

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("Project")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || data.status !== "PUBLISHED") return null;
  return data as Project;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Case Study Not Found | Strathmore Marketing Club" };
  }

  return {
    title: `${project.title} | Strathmore Marketing Club`,
    description: project.desc,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-amber hover:text-amber/80 transition-colors mb-8"
        >
          <ArrowLeft size={14} className="shrink-0" />
          <span>Back to portfolio</span>
        </Link>

        <CaseStudyDetail project={project} />
      </div>
    </section>
  );
}
