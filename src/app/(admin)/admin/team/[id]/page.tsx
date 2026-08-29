import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditTeamClient from "./EditTeamClient";
import { ArrowLeft } from "@/components/icons";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { data: member } = await supabase
    .from("TeamMember")
    .select("*")
    .eq("id", id)
    .single();

  if (!member) notFound();

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/team"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} className="shrink-0" />
          <span>Executive Team</span>
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide">Edit Profile</h1>
          <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full bg-amber/15 text-amber">
            {member.role}
          </span>
        </div>
        <p className="font-body text-cream/25 text-xs mt-1.5">
          {member.name} · {member.course}
        </p>
      </div>
      <EditTeamClient member={member as any} />
    </div>
  );
}
