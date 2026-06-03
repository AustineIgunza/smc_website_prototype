"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import Countdown from "./ui/Countdown";
import { useTheme } from "./ThemeProvider";

/* ── Types ──────────────────────────────────────────────── */
interface ApiEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "FREE" | "PAID";
  priceKes: number;
  capacity: number | null;
  spotsRemaining: number | null;
  startsAt: string;
  location: string;
  ownerType: string;
}

const filterTags = ["All", "Flagship", "Workshop", "Networking", "Competition"] as const;
type FilterTag = (typeof filterTags)[number];

/* ── Event Detail Modal Content ──────────────────────── */
function EventDetail({
  event,
  onRegistered,
}: {
  event: ApiEvent;
  onRegistered: () => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const inputClass = `w-full px-4 py-2.5 rounded-lg font-body text-sm outline-none transition-colors border ${
    dark
      ? "bg-cream/5 border-cream/15 text-cream placeholder:text-cream/30 focus:border-amber"
      : "bg-navy/5 border-navy/15 text-navy placeholder:text-navy/30 focus:border-amber"
  }`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${event.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        onRegistered();
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pr-6">
      <span className="inline-block font-body text-xs font-semibold tracking-widest uppercase bg-amber/10 text-amber px-3 py-1 rounded-full mb-4">
        {event.category}
      </span>
      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {event.title}
      </h3>

      <div
        className={`flex flex-wrap gap-x-5 gap-y-1 font-body text-sm mb-5 ${
          dark ? "text-cream/50" : "text-navy/50"
        }`}
      >
        <span>
          {new Date(event.startsAt).toLocaleDateString("en-KE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>
          {new Date(event.startsAt).toLocaleTimeString("en-KE", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <span>{event.location}</span>
      </div>

      <p
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/70"
        }`}
      >
        {event.description}
      </p>

      {event.type === "PAID" && (
        <div className="mb-5">
          <span className="inline-block font-body text-sm font-semibold px-3 py-1 rounded-full bg-amber/10 text-amber">
            KES {event.priceKes.toLocaleString()}
          </span>
        </div>
      )}

      {/* RSVP */}
      {event.type === "PAID" ? (
        <span className={`font-body text-sm ${dark ? "text-cream/40" : "text-navy/40"}`}>
          Paid event — ticketing coming soon
        </span>
      ) : done ? (
        <div className="flex items-start gap-3 rounded-xl bg-green-500/10 px-4 py-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-400 shrink-0 mt-0.5"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <div>
            <p className="font-body text-sm font-semibold text-green-400">
              You&rsquo;re registered!
            </p>
            <p className={`font-body text-sm ${dark ? "text-cream/60" : "text-navy/60"}`}>
              We&rsquo;ve saved your spot for {event.title}. A confirmation will be sent to{" "}
              {email}.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              minLength={2}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              aria-label="Full name"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              aria-label="Email address"
            />
          </div>
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            aria-label="Phone number (optional)"
          />

          {error && (
            <p className="font-body text-sm text-red-400">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <motion.button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide bg-amber text-teal hover:bg-gold transition-colors cursor-pointer disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Registering..." : "Register Now"}
            </motion.button>
            {event.spotsRemaining !== null && (
              <span className={`font-body text-sm ${dark ? "text-cream/40" : "text-navy/40"}`}>
                {event.spotsRemaining} spots left
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Marquee ticker ──────────────────────────────────── */
function EventMarquee({ events }: { events: ApiEvent[] }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const items = events.map(
    (e) =>
      `${e.title} — ${new Date(e.startsAt).toLocaleDateString("en-KE", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`
  );
  const joined = items.join("   •   ");

  if (prefersReduced) {
    return (
      <div
        className={`overflow-hidden py-3 border-y ${
          dark ? "border-cream/5" : "border-navy/5"
        }`}
      >
        <p
          className={`font-body text-xs tracking-wide ${
            dark ? "text-cream/30" : "text-navy/30"
          }`}
        >
          Upcoming: {joined}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden py-3 border-y group ${
        dark ? "border-cream/5" : "border-navy/5"
      }`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className={`font-body text-xs tracking-wide mr-8 ${
              dark ? "text-cream/30" : "text-navy/30"
            }`}
          >
            {joined}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Main Events Component ───────────────────────────── */
export default function Events() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTag>("All");
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);

  // Fetch events from API
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  const nextEvent = useMemo(() => {
    const now = Date.now();
    const upcoming = events
      .filter((e) => new Date(e.startsAt).getTime() > now)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );
    return upcoming[0] ?? events[0];
  }, [events]);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? events
        : events.filter((e) => e.category === activeFilter),
    [activeFilter, events]
  );

  const refreshEvents = useCallback(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  if (events.length === 0) {
    return (
      <section
        className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
          dark ? "bg-teal" : "bg-cream"
        }`}
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className={`font-body ${dark ? "text-cream/40" : "text-navy/40"}`}>
            Loading events...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="grid" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Events
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            What We <span className="text-amber">Do</span>
          </h2>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-10 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            From workshops to competitions, every event is designed to stretch
            your thinking and build real skills.
          </p>
        </Reveal>

        {/* Countdown + Marquee */}
        {nextEvent && (
          <Reveal delay={0.1}>
            <div className="mb-8 sm:mb-10 max-w-md mx-auto sm:mx-0">
              <Countdown targetDate={nextEvent.startsAt} label={nextEvent.title} />
            </div>
            <EventMarquee events={events} />
          </Reveal>
        )}

        {/* Filter tabs */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-2 mt-8 sm:mt-10 mb-6 sm:mb-8">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeFilter === tag
                    ? "bg-amber text-teal"
                    : dark
                      ? "bg-cream/5 text-cream/60 hover:bg-cream/10"
                      : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Event cards grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
                }
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ClickableCard
                  onClick={() => setSelectedEvent(event)}
                  cue="View details"
                  className={dark ? "bg-navy/60" : "bg-white shadow-sm"}
                >
                  <div className="p-5 sm:p-7">
                    {/* Tag + spots badge */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.span
                        className="inline-block font-body text-xs font-semibold tracking-widest uppercase bg-amber/10 text-amber px-3 py-1 rounded-full group-hover:bg-amber/20 transition-colors"
                        whileHover={prefersReduced ? {} : { scale: 1.05 }}
                      >
                        {event.category}
                      </motion.span>
                      <div className="flex items-center gap-2">
                        {event.type === "PAID" && (
                          <span className="font-body text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber/10 text-amber">
                            KES {event.priceKes}
                          </span>
                        )}
                        {event.spotsRemaining !== null && (
                          <span
                            className={`font-body text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                              event.spotsRemaining <= 10
                                ? "bg-red-500/10 text-red-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {event.spotsRemaining} spots
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
                        dark ? "text-cream" : "text-navy"
                      }`}
                    >
                      {event.title}
                    </h3>
                    <p
                      className={`font-body text-sm font-medium mb-3 ${
                        dark ? "text-cream/40" : "text-navy/40"
                      }`}
                    >
                      {new Date(event.startsAt).toLocaleDateString("en-KE", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p
                      className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
                        dark ? "text-cream/65" : "text-navy/80"
                      }`}
                    >
                      {event.description}
                    </p>

                    {/* Location row */}
                    <div
                      className={`flex flex-wrap gap-x-4 gap-y-1 font-body text-xs ${
                        dark ? "text-cream/30" : "text-navy/30"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                  </div>
                </ClickableCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              No events in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <DetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <EventDetail
            key={selectedEvent.id}
            event={selectedEvent}
            onRegistered={refreshEvents}
          />
        )}
      </DetailModal>
    </section>
  );
}
