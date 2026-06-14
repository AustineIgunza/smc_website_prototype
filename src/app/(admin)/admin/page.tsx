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
    { count: totalTeam },
    { count: totalEvents },
    { count: publishedEvents },
    { count: draftEvents },
    { count: paidEvents },
    homeRow,
  ] = await Promise.all([
    supabase.from("Project").select("*", { count: "exact", head: true }),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
    supabase.from("Project").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("TeamMember").select("*", { count: "exact", head: true }),
    supabase.from("Event").select("*", { count: "exact", head: true }),
    supabase.from("Event").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
    supabase.from("Event").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
    supabase.from("Event").select("*", { count: "exact", head: true }).eq("type", "PAID"),
    supabase.from("HomeContent").select("updatedAt").eq("id", "home").maybeSingle(),
  ]);

  const homeUpdatedLabel = homeRow.data?.updatedAt
    ? `Last saved ${new Date(homeRow.data.updatedAt as string).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "Not saved yet";

  type Stat = { value: number | string | null; label: string };
  type Section = { href: string; label: string; description: string; stats: Stat[]; meta?: string; cta: string };

  const sections: Section[] = [
    {
      href: "/admin/home",
      label: "Homepage Content",
      description: "Edit the hero, mission, vision, story, stats, and Inside the Agency copy.",
      stats: [],
      meta: homeUpdatedLabel,
      cta: "Edit homepage →",
    },
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
    {
      href: "/admin/team",
      label: "Executive Team",
      description: "Manage club leadership profiles and focus areas.",
      stats: [
        { value: totalTeam, label: "Total Members" },
      ],
      cta: "Manage team →",
    },
    {
      href: "/admin/events",
      label: "Club Events",
      description: "Create, publish, and manage registrations/payments.",
      stats: [
        { value: totalEvents, label: "Total" },
        { value: publishedEvents, label: "Published" },
        { value: draftEvents, label: "Drafts" },
        { value: paidEvents, label: "Paid" },
      ],
      cta: "Manage events →",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-5xl mx-auto">
      <div className="mb-10 pb-6 border-b border-cream/10">
        <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
          Dashboard
        </h1>
        <p className="font-display text-lg sm:text-xl text-cream/70 mt-1">
          Welcome back, {user.email}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block rounded-2xl bg-navy/60 backdrop-blur-sm border border-cream/10 hover:border-amber/40 p-6 transition-all duration-300 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.06)] flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display font-bold text-cream text-lg mb-1 group-hover:text-amber transition-colors">
                {section.label}
              </h2>
              <p className="font-body text-cream/40 text-sm mb-6 leading-relaxed">
                {section.description}
              </p>

              {section.stats.length > 0 && (
                <div className={`grid gap-3 mb-6 ${section.stats.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-navy/40 border border-cream/5 text-center">
                      <p className="font-display font-bold text-2xl text-amber">
                        {stat.value}
                      </p>
                      <p className="font-body text-cream/40 text-[9px] uppercase font-semibold tracking-wider mt-1.5 leading-none">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {section.meta && (
                <div className="p-3 rounded-xl bg-navy/40 border border-cream/5 text-center mb-6">
                  <p className="font-body text-cream/60 text-xs uppercase font-semibold tracking-wider">
                    {section.meta}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-cream/5 flex items-center justify-between">
              <span className="font-body text-sm font-semibold text-amber/70 group-hover:text-amber transition-all duration-200 group-hover:translate-x-1">
                {section.cta}
              </span>
              <span className="font-body text-xs text-cream/20 group-hover:text-amber/40 transition-colors">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
