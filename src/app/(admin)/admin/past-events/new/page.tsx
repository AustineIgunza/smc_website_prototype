import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PastEventForm, { PastEventSubmitPayload } from "../PastEventForm";
import { ArrowLeft } from "@/components/icons";

export default async function NewPastEventPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  async function createPastEvent(data: PastEventSubmitPayload) {
    "use server";
    const serverSupabase = await createClient();
    const {
      data: { user: authUser },
    } = await serverSupabase.auth.getUser();
    if (!authUser) return { error: "Unauthorized" };

    const { data: existing } = await serverSupabase
      .from("PastEvent")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();

    if (existing) {
      return { error: "An event with this slug already exists" };
    }

    const { error } = await serverSupabase.from("PastEvent").insert({
      id: `past-${Date.now()}`,
      slug: data.slug,
      title: data.title,
      description: data.description,
      category: data.category || "",
      date: data.date || new Date().toISOString(),
      location: data.location || "",
      attendanceCount: data.attendanceCount ?? null,
      coverImageUrl: data.coverImageUrl || "",
      galleryUrls: data.galleryUrls || [],
      highlights: data.highlights || [],
      keyTakeaways: data.keyTakeaways || [],
      speakers: data.speakers || [],
      partnerName: data.partnerName || null,
      testimonial: data.testimonial || null,
      testimonialAuthor: data.testimonialAuthor || null,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) return { error: error.message };
    return {};
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 sm:px-10 max-w-4xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/past-events"
          className="font-body text-cream/45 text-xs hover:text-cream/70 transition-colors inline-flex items-center gap-1.5 mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Past Events</span>
        </Link>
        <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
          New Past Event Archive
        </h1>
        <p className="font-body text-cream/40 text-sm mt-1">
          Archive a previous event with key takeaways, highlights, metrics, and photo gallery.
        </p>
      </div>

      <PastEventForm
        onSubmit={createPastEvent}
        submitLabel="Create Past Event Archive"
      />
    </div>
  );
}
