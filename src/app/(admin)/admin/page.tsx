import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    { count: total },
    { count: published },
    { count: draft },
    { count: featured },
  ] = await Promise.all([
    supabase.from("Project").select("*", { count: "exact", head: true }),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("featured", true),
  ]);

  const sections = [
    {
      href: "/admin/projects",
      label: "Portfolio Projects",
      description: "Create, edit, and publish case studies.",
      stats: [
        { value: total, label: "Total" },
        { value: published, label: "Published" },
        { value: draft, label: "Drafts" },
        { value: featured, label: "Featured" },
      ],
      cta: "Manage projects →",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="font-body text-cream/40 text-sm font-semibold uppercase tracking-widest mb-2">
          Dashboard
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream">
          Welcome back
        </h1>
        <p className="font-body text-cream/40 text-sm mt-2">
          {user.email}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block rounded-2xl bg-navy/60 border border-cream/10 hover:border-amber/40 p-6 transition-all hover:bg-navy/80"
          >
            <h2 className="font-display font-bold text-cream text-lg mb-1 group-hover:text-amber transition-colors">
              {section.label}
            </h2>
            <p className="font-body text-cream/40 text-sm mb-6">
              {section.description}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {section.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl text-cream">
                    {stat.value}
                  </p>
                  <p className="font-body text-cream/40 text-xs mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <span className="font-body text-sm font-semibold text-amber/70 group-hover:text-amber transition-colors">
              {section.cta}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
