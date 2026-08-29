import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Images, Users, Plus, ArrowLeft } from "@/components/icons";
import { getCategoryGradient } from "@/data/eventCategories";

export default async function AdminPastEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: dbEvents } = await supabase
    .from("PastEvent")
    .select("*")
    .order("date", { ascending: false });

  const events = dbEvents || [];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 sm:px-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-cream/10">
        <div>
          <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
            Past Events & Gallery
          </h1>
          <p className="font-body text-cream/40 text-sm mt-1">
            {events.length} {events.length === 1 ? "past event archive" : "past event archives"}
          </p>
        </div>
        <Link
          href="/admin/past-events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap shadow-lg"
        >
          <Plus size={16} />
          <span>New Past Event</span>
        </Link>
      </div>

      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="font-body text-cream/45 text-xs hover:text-cream/70 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Grid of Past Events */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-navy/40 border border-cream/5 rounded-2xl">
          <p className="font-display text-4xl mb-3 opacity-20">✦</p>
          <p className="font-body text-cream/30 text-sm">
            No past event archives found.
          </p>
          <Link
            href="/admin/past-events/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all"
          >
            <Plus size={14} />
            Create First Archive
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const colors = getCategoryGradient(event.category);
            const photoCount = event.galleryUrls?.length || (event.coverImageUrl ? 1 : 0);

            return (
              <Link
                key={event.id}
                href={`/admin/past-events/${event.id}`}
                className="group flex flex-col p-6 rounded-2xl bg-navy/60 border border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] transition-all duration-300 justify-between text-left"
              >
                <div>
                  {/* Event Cover Photo */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-cream/10 bg-navy/80">
                    {event.coverImageUrl ? (
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-display font-bold text-2xl"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                        }}
                      >
                        {event.title.charAt(0)}
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-body text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber text-teal">
                        {event.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/75 text-cream text-[10px] font-body px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <Images size={12} className="text-amber" />
                      <span>{photoCount} Photos</span>
                    </div>
                  </div>

                  <h4 className="font-display text-base font-bold mb-1.5 line-clamp-1 text-cream group-hover:text-amber transition-colors">
                    {event.title}
                  </h4>

                  <p className="font-body text-cream/45 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-cream/5 font-body text-[11px] text-cream/50 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-amber" />
                    {new Date(event.date).toLocaleDateString("en-KE", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  {event.attendanceCount && (
                    <span className="flex items-center gap-1 text-amber/80 font-semibold">
                      <Users size={12} />
                      {event.attendanceCount}+
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
