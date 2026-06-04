import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { filter = "all" } = await searchParams;

  const { data: projects = [] } = await supabase
    .from("Project")
    .select("*")
    .order("createdAt", { ascending: false });

  const filtered =
    filter === "published"
      ? projects.filter((p) => p.status === "PUBLISHED")
      : filter === "draft"
        ? projects.filter((p) => p.status === "DRAFT")
        : projects;

  const counts = {
    all: projects.length,
    published: projects.filter((p) => p.status === "PUBLISHED").length,
    draft: projects.filter((p) => p.status === "DRAFT").length,
  };

  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "published", label: "Published", count: counts.published },
    { key: "draft", label: "Draft", count: counts.draft },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream">
            Portfolio Projects
          </h1>
          <p className="font-body text-cream/40 text-sm mt-1">
            {counts.published} published · {counts.draft} drafts
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap"
        >
          + New Project
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/projects?filter=${tab.key}`}
            className={`px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-colors ${
              filter === tab.key
                ? "bg-amber text-teal"
                : "bg-cream/5 text-cream/50 hover:bg-cream/10 hover:text-cream/70"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-[10px] ${
                filter === tab.key ? "opacity-70" : "opacity-50"
              }`}
            >
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Project list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-4xl mb-3 opacity-20">✦</p>
          <p className="font-body text-cream/30 text-sm">
            {filter === "draft"
              ? "No drafts. All projects are published."
              : filter === "published"
                ? "No published projects yet."
                : "No projects yet. Create your first one."}
          </p>
          {filter === "all" && (
            <Link
              href="/admin/projects/new"
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all"
            >
              Create first project
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-navy/60 border border-cream/5 hover:border-cream/15 hover:bg-navy/80 transition-all"
            >
              {/* Cover image thumbnail */}
              {p.coverImageUrl ? (
                <div
                  className="hidden sm:block w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0 border border-cream/10"
                  style={{ backgroundImage: `url(${p.coverImageUrl})` }}
                />
              ) : (
                <div className="hidden sm:flex w-12 h-12 rounded-lg bg-cream/5 border border-cream/10 flex-shrink-0 items-center justify-center">
                  <span className="font-display text-lg text-cream/20 font-bold">
                    {p.title.charAt(0)}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-bold text-cream text-sm group-hover:text-amber transition-colors truncate">
                    {p.title}
                  </p>
                  {p.featured && (
                    <span className="text-amber text-xs">★</span>
                  )}
                </div>
                <p className="font-body text-cream/40 text-xs mt-0.5">
                  {p.category}
                  {p.clientName && ` · ${p.clientName}`}
                  {` · ${p.duration}`}
                </p>
              </div>

              {/* Status */}
              <span
                className={`flex-shrink-0 font-body text-xs font-semibold px-2.5 py-1 rounded-full ${
                  p.status === "PUBLISHED"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-cream/10 text-cream/40"
                }`}
              >
                {p.status}
              </span>

              <span className="font-body text-cream/20 text-xs hidden sm:block group-hover:text-cream/40 transition-colors">
                Edit →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
