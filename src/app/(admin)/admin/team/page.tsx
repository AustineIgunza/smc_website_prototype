import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus, ArrowLeft } from "@/components/icons";

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
      <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-cream/10">
        <div>
          <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
            Executive Team
          </h1>
          <p className="font-body text-cream/40 text-sm mt-1">
            {members.length} team {members.length === 1 ? "member" : "members"} in database
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap inline-flex items-center gap-1.5"
        >
          <Plus size={16} className="shrink-0" />
          <span>New Member</span>
        </Link>
      </div>

      {/* Back to dashboard */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="font-body text-cream/45 text-xs hover:text-cream/70 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} className="shrink-0" />
          <span>Back to Dashboard</span>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {members.map((member) => {
            const startColor = member.avatarGradient?.[0] ?? "#FFA829";
            const endColor = member.avatarGradient?.[1] ?? "#CC8802";
            const hasAvatar = !!member.avatarUrl;

            return (
              <Link
                key={member.id}
                href={`/admin/team/${member.id}`}
                className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-navy/60 border border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] transition-all duration-300 text-center justify-between"
              >
                <div>
                  {/* Live Avatar Preview */}
                  <div className="mx-auto mb-5 w-fit relative">
                    {hasAvatar ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-full overflow-hidden border border-white/20 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={member.avatarUrl!}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl shadow-md border border-white/20 dark:border-white/10 select-none transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                        }}
                      >
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Role Tag Row */}
                  <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                    <span className="font-body text-[9px] uppercase font-semibold text-amber/80 tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                      {member.role}
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold mb-2 line-clamp-1 text-cream group-hover:text-amber transition-colors">
                    {member.name}
                  </h4>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-cream/5 font-body text-[11px] text-cream/50 space-y-1">
                  <p className="truncate">{member.title}</p>
                  <p className="text-[10px] text-cream/35 truncate">
                    {member.course} · {member.year}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
