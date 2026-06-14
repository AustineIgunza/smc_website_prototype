import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewEventClient from "./NewEventClient";

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: partnersData } = await supabase
    .from("Partner")
    .select("id, name")
    .order("name", { ascending: true });
  const partners = partnersData || [];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link href="/admin/events" className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors">
          ← Club Events
        </Link>
        <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide mt-3">New Event</h1>
        <p className="font-body text-cream/40 text-sm mt-1.5">Fill in the details below to create a new free or paid event.</p>
      </div>
      <NewEventClient partners={partners} />
    </div>
  );
}
