import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: membersData } = await supabase
    .from("TeamMember")
    .select("*")
    .order("createdAt", { ascending: true });
  const members = membersData || [];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream">
            Executive Team
          </h1>
          <p className="font-body text-cream/40 text-sm mt-1">
            {members.length} team {members.length === 1 ? "member" : "members"} registered in database
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap"
        >
          + New Member
        </Link>
      </div>

      {/* Back to dashboard */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="font-body text-cream/45 text-xs hover:text-cream/70 transition-colors flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Team list */}
      {members.length === 0 ? (
        <div className="text-center py-20 bg-navy/40 border border-cream/5 rounded-2xl">
          <p className="font-display text-4xl mb-3 opacity-20">✦</p>
          <p className="font-body text-cream/30 text-sm">
            No team members found in the database.
          </p>
          <Link
            href="/admin/team/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all"
          >
            Create first profile
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => {
            const startColor = member.avatarGradient?.[0] ?? "#FFA829";
            const endColor = member.avatarGradient?.[1] ?? "#CC8802";
            return (
              <Link
                key={member.id}
                href={`/admin/team/${member.id}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-navy/60 border border-cream/5 hover:border-cream/15 hover:bg-navy/80 transition-all"
              >
                {/* Live Gradient Avatar Preview */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-cream font-display font-bold text-base flex-shrink-0 shadow-sm border border-cream/10 select-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-bold text-cream text-sm group-hover:text-amber transition-colors truncate">
                      {member.name}
                    </p>
                    <span className="font-body text-[10px] uppercase font-semibold text-amber/80 tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                      {member.role}
                    </span>
                  </div>
                  <p className="font-body text-cream/40 text-xs mt-1 truncate">
                    {member.title}
                  </p>
                  <p className="font-body text-cream/30 text-[10px] mt-0.5">
                    {member.course} · {member.year}
                  </p>
                </div>

                <span className="font-body text-cream/20 text-xs hidden sm:block group-hover:text-cream/40 transition-colors">
                  Edit →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
