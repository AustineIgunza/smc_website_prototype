import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/home-content";
import HomeForm from "./HomeForm";

export default async function AdminHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const content = await getHomeContent();

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-3xl mx-auto">
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
          Homepage Content
        </h1>
        <p className="font-body text-cream/40 text-sm mt-1">
          Edit every line of copy on the public homepage. Changes go live as soon as you save.
        </p>
      </div>

      <HomeForm initial={content} />
    </div>
  );
}
