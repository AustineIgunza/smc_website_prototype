import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPartnershipsContent } from "@/lib/partnerships-content";
import PartnershipsForm from "./PartnershipsForm";

export default async function AdminPartnershipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const content = await getPartnershipsContent();

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
          Partnerships Content
        </h1>
        <p className="font-body text-cream/40 text-sm mt-1">
          Manage internal university alliances and external corporate partners displayed on the Portfolio page.
        </p>
      </div>

      <PartnershipsForm initial={content} />
    </div>
  );
}
