import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PastEventForm, { PastEventSubmitPayload } from "../PastEventForm";
import { ArrowLeft } from "@/components/icons";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPastEventPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: event } = await supabase
    .from("PastEvent")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();

  async function updatePastEvent(data: PastEventSubmitPayload) {
    "use server";
    const serverSupabase = await createClient();
    const {
      data: { user: authUser },
    } = await serverSupabase.auth.getUser();
    if (!authUser) return { error: "Unauthorized" };

    const { error } = await serverSupabase
      .from("PastEvent")
      .upsert({
        id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        location: data.location,
        attendanceCount: data.attendanceCount,
        coverImageUrl: data.coverImageUrl,
        galleryUrls: data.galleryUrls,
        highlights: data.highlights,
        keyTakeaways: data.keyTakeaways,
        speakers: data.speakers,
        partnerName: data.partnerName,
        testimonial: data.testimonial,
        testimonialAuthor: data.testimonialAuthor,
        status: data.status,
        updatedAt: new Date().toISOString(),
      });

    if (error) return { error: error.message };
    return {};
  }

  async function deletePastEvent() {
    "use server";
    const serverSupabase = await createClient();
    const {
      data: { user: authUser },
    } = await serverSupabase.auth.getUser();
    if (!authUser) throw new Error("Unauthorized");

    const { error } = await serverSupabase
      .from("PastEvent")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
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
          Edit Past Event Archive
        </h1>
        <p className="font-body text-cream/40 text-sm mt-1">
          Update event recap, strategic takeaways, and manage photo gallery.
        </p>
      </div>

      <PastEventForm
        initial={event}
        onSubmit={updatePastEvent}
        submitLabel="Save Changes"
        onDelete={deletePastEvent}
        isEdit
      />
    </div>
  );
}
