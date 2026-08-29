import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembershipContent } from "@/lib/membership-content";
import MembershipForm from "./MembershipForm";

export default async function AdminMembershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const content = await getMembershipContent();

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin"
          className="font-body text-cream/45 text-xs hover:text-cream/70 transition-colors flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream">
          Membership Page Content
        </h1>
        <p className="font-body text-cream/40 text-sm mt-1">
          Edit every aspect of the Membership page: headers, onboarding steps, CTAs, and dynamic member benefits without writing code.
        </p>
      </div>

      <MembershipForm initial={content} />
    </div>
  );
}
