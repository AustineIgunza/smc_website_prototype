import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus, ArrowLeft, Calendar, MapPin, Users } from "@/components/icons";
import { getCategoryGradient } from "@/data/eventCategories";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: eventsData } = await supabase
    .from("Event")
    .select("*, partner:Partner(name), Registration(id, status)")
    .order("startsAt", { ascending: true });
  const events = eventsData || [];

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-cream/10">
        <div>
          <h1 className="font-accent text-amber text-4xl sm:text-5xl font-bold tracking-wide">
            Club Events
          </h1>
          <p className="font-body text-cream/40 text-sm mt-1">
            {events.length} {events.length === 1 ? "event" : "events"} in database
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap inline-flex items-center gap-1.5"
        >
          <Plus size={16} className="shrink-0" />
          <span>New Event</span>
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

      {/* Events list */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-navy/40 border border-cream/5 rounded-2xl">
          <p className="font-display text-4xl mb-3 opacity-20">✦</p>
          <p className="font-body text-cream/30 text-sm">
            No events found in the database.
          </p>
          <Link
            href="/admin/events/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all"
          >
            Create first event
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => {
            const colors = getCategoryGradient(event.category);
            const activeRegs = ((event.Registration as { status: string }[] | null) ?? []).filter(
              (r) => r.status !== "CANCELLED",
            ).length;
            const hasFlyer = !!event.imageUrl;

            return (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}`}
                className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-navy/60 border border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] transition-all duration-300 text-center justify-between"
              >
                <div>
                  {/* Event Flyer / Icon representation */}
                  <div className="mx-auto mb-5 w-fit relative">
                    {hasFlyer ? (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={event.imageUrl!}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl sm:text-4xl shadow-md border border-white/20 dark:border-white/10 select-none transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                        }}
                      >
                        {event.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Status & Category Tag Row */}
                  <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                    <span className="font-body text-[9px] uppercase font-semibold text-amber/80 tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                      {event.category}
                    </span>
                    <span
                      className={`font-body text-[9px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded border ${
                        event.status === "PUBLISHED"
                          ? "text-green-400 bg-green-500/5 border-green-500/10"
                          : event.status === "DRAFT"
                            ? "text-amber bg-amber/5 border-amber/10"
                            : "text-red-400 bg-red-500/5 border-red-500/10"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold mb-2 line-clamp-1 text-cream group-hover:text-amber transition-colors">
                    {event.title}
                  </h4>

                  <p className="font-body text-cream/45 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="pt-4 border-t border-cream/5 font-body text-[11px] text-cream/50 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-amber shrink-0" />
                    <span>
                      {new Date(event.startsAt).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-amber shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </p>
                  <div className="flex justify-between items-center pt-2 mt-1 text-[10px]">
                    <span className="font-semibold text-amber/90">
                      {event.type === "PAID" ? `KES ${event.priceKes.toLocaleString()}` : "FREE"}
                    </span>
                    <span className="text-cream/35 inline-flex items-center gap-1">
                      <Users size={11} className="shrink-0" />
                      <span>{activeRegs} / {event.capacity ?? "∞"} registered</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
