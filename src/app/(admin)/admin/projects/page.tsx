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

  const { data: projectsData } = await supabase
    .from("Project")
    .select("*")
    .order("createdAt", { ascending: false });
  const projects = projectsData || [];

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
      <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-cream/10">
        <div>
          <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((p) => {
            const hasCover = !!p.coverImageUrl;

            return (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-navy/60 border border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] transition-all duration-300 text-center justify-between"
              >
                <div>
                  {/* Cover thumbnail or fallback */}
                  <div className="mx-auto mb-5 w-fit relative">
                    {hasCover ? (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={p.coverImageUrl!}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cream/5 border border-white/20 dark:border-white/10 flex items-center justify-center select-none transition-transform duration-300 group-hover:scale-105">
                        <span className="font-display text-2xl text-cream/20 font-bold">
                          {p.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                    <span className="font-body text-[9px] uppercase font-semibold text-amber/80 tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                      {p.category}
                    </span>
                    <span
                      className={`font-body text-[9px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded border ${
                        p.status === "PUBLISHED"
                          ? "text-green-400 bg-green-500/5 border-green-500/10"
                          : "text-cream/40 bg-cream/5 border-cream/10"
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.featured && (
                      <span className="font-body text-[9px] uppercase font-semibold tracking-wider text-amber bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold mb-2 line-clamp-1 text-cream group-hover:text-amber transition-colors">
                    {p.title}
                  </h4>

                  <p className="font-body text-cream/45 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-cream/5 font-body text-[11px] text-cream/50 space-y-1">
                  {p.clientName && <p>👤 Client: {p.clientName}</p>}
                  <p>⏱️ Duration: {p.duration}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {p.tags.slice(0, 2).map((t: string) => (
                        <span
                          key={t}
                          className="font-body text-[8px] font-medium tracking-wide px-2 py-0.5 rounded bg-cream/5 text-cream/40 border border-cream/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
