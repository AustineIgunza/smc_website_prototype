"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import Countdown from "./ui/Countdown";
import { useTheme } from "./ThemeProvider";
import { Calendar, MapPin, CheckCircle2, Clock } from "./icons";

import {
  getCategoryGradient,
  getCategoryBadgeStyle,
  EVENT_CATEGORIES,
} from "@/data/eventCategories";

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
  imageUrl: string | null;
}

/* ── Content staggers animation variables for modal ──── */
const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

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
      const endpoint = event.type === "PAID" ? `/api/events/${event.slug}/pay` : `/api/events/${event.slug}/rsvp`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        if (event.type === "PAID") {
          // Redirect to payment page
          window.location.href = `/payment/${data.registrationId}`;
        } else {
          setDone(true);
          onRegistered();
        }
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const colors = getCategoryGradient(event.category);
  const hasFlyer = !!event.imageUrl;

  return (
    <div className="pr-4">
      {/* 1. Header with flyer & titles */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6"
      >
        {hasFlyer ? (
          <img
            src={event.imageUrl!}
            alt={event.title}
            className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border border-white/10 shadow-lg"
          />
        ) : (
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-white font-display font-bold text-4xl sm:text-5xl shadow-md border border-white/10 select-none"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            }}
          >
            {event.title.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center sm:text-left">
          <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-amber mb-1">
            {event.category}
          </p>
          <h3
            className={`font-display text-xl sm:text-2xl font-bold mb-1 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            {event.title}
          </h3>
          <div className={`font-body text-xs ${dark ? "text-cream/50" : "text-navy/60"} flex flex-wrap items-center gap-x-3 gap-y-1 justify-center sm:justify-start mt-1.5`}>
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="text-amber shrink-0" />
              <span>{event.location}</span>
            </span>
            <span className="text-cream/20 dark:text-cream/20">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={13} className="text-amber shrink-0" />
              <span>{new Date(event.startsAt).toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Description */}
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className={`font-body text-sm leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {event.description}
      </motion.p>

      {/* 3. Specs / Pricing */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="relative pl-6 pr-2 py-4 mb-6 border-l-4 border-amber bg-amber/5 rounded-r-xl"
      >
        <p className="font-display text-sm font-semibold text-navy/90 dark:text-cream/90">
          {event.type === "PAID" ? (
            <span>Admission: <strong className="text-amber">KES {event.priceKes.toLocaleString()}</strong> (M-Pesa payment required)</span>
          ) : (
            <span>Admission: <strong className="text-amber">FREE RSVP</strong></span>
          )}
        </p>
        <p className={`font-body text-xs mt-1 ${dark ? "text-cream/55" : "text-navy/55"}`}>
          Starts at {new Date(event.startsAt).toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" })}
        </p>
      </motion.div>

      {/* 4. RSVP Form */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={contentVariants}>
        {done ? (
          <div className="flex items-start gap-3 rounded-xl bg-green-500/10 px-4 py-4">
            <CheckCircle2 size={22} className="text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-green-400">
                You&rsquo;re registered!
              </p>
              <p className={`font-body text-sm ${dark ? "text-cream/60" : "text-navy/60"}`}>
                We&rsquo;ve saved your spot for {event.title}. A confirmation will be sent to {email}.
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
              required={event.type === "PAID"}
              placeholder={event.type === "PAID" ? "M-Pesa Phone (07XXXXXXXX)" : "Phone number (optional)"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              aria-label="Phone number"
            />

            {error && (
              <p className="font-body text-sm text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide bg-amber text-teal hover:bg-gold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Processing..." : event.type === "PAID" ? "Pay & Register" : "Register Now"}
              </button>
              {event.spotsRemaining !== null && (
                <span className={`font-body text-xs font-semibold tracking-wide uppercase ${
                  event.spotsRemaining <= 10 ? "text-red-400" : "text-amber"
                }`}>
                  {event.spotsRemaining} spots left
                </span>
              )}
            </div>
          </form>
        )}
      </motion.div>
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
      `${e.title} · ${new Date(e.startsAt).toLocaleDateString("en-KE", {
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
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filterCategories = useMemo(() => {
    const categoriesFromEvents = Array.from(
      new Set(events.map((e) => e.category).filter(Boolean))
    );
    return Array.from(
      new Set([
        "All",
        ...categoriesFromEvents,
        ...EVENT_CATEGORIES.map((c) => c.label),
      ])
    );
  }, [events]);

  // Fetch events from API
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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

  if (loading) {
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
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Navigation Switcher Tabs */}
        <Reveal y={20}>
          <div className="flex justify-center mb-8">
            <div
              className={`inline-flex p-1.5 rounded-full border backdrop-blur-md ${
                dark
                  ? "bg-navy/60 border-cream/10"
                  : "bg-navy/5 border-navy/10"
              }`}
            >
              <span className="px-5 py-2 rounded-full font-body text-xs font-semibold tracking-wide bg-amber text-teal shadow-md">
                Upcoming Events
              </span>
              <Link
                href="/events/past"
                className={`px-5 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-all ${
                  dark
                    ? "text-cream/60 hover:text-cream"
                    : "text-navy/60 hover:text-navy"
                }`}
              >
                Past Events & Gallery
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Main Heading - Leadership-like display header */}
        <Reveal y={40}>
          <h1 className="font-accent text-amber text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-4 tracking-wide">
            Calendar
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Club <span className="text-amber">Events</span>
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-20 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            From flagship summits to hands-on bootcamps, every event is designed
            to expand your creative horizons. Click anyone to learn more.
          </p>
        </Reveal>

        {/* Countdown & Marquee */}
        {nextEvent && (
          <Reveal y={40} delay={0.1}>
            <div className="mb-8 sm:mb-10 max-w-md mx-auto sm:mx-0">
              <Countdown targetDate={nextEvent.startsAt} label={nextEvent.title} />
            </div>
            <EventMarquee events={events} />
          </Reveal>
        )}

        {/* Filter tabs */}
        <Reveal y={40} delay={0.15}>
          <div className="flex items-center gap-4 mt-12 mb-6">
            <h3 className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${dark ? "text-amber" : "text-gold"}`}>
              Event Categories
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {filterCategories.map((tag) => (
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

        {/* Event cards grid - styled like Team layout */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          stagger={0.08}
        >
          {filtered.map((event) => {
            const colors = getCategoryGradient(event.category);
            const hasFlyer = !!event.imageUrl;

            return (
              <StaggerItem key={event.id} y={40}>
                <ClickableCard
                  onClick={() => setSelectedEvent(event)}
                  cue="View details"
                  className="transition-all duration-300 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] dark:hover:shadow-[0_16px_32px_rgba(255,168,41,0.15)]"
                >
                  <div
                    className="p-6 sm:p-8 text-center"
                    onMouseEnter={() => setHoveredId(event.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Event Flyer / Icon representation */}
                    <motion.div
                      className="mx-auto mb-5 w-fit relative"
                      whileHover={
                        prefersReduced ? {} : { scale: 1.06, transition: { duration: 0.2 } }
                      }
                    >
                      {/* Glow backdrop */}
                      {!prefersReduced && (
                        <div
                          className={`absolute inset-0 rounded-2xl blur-md opacity-0 transition-opacity duration-300 pointer-events-none ${
                            hoveredId === event.id ? "opacity-45" : ""
                          }`}
                          style={{
                            background: hasFlyer
                              ? `radial-gradient(circle, rgba(255,168,41,0.6) 0%, rgba(204,136,2,0.4) 100%)`
                              : `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 100%)`,
                            transform: "scale(1.1)",
                          }}
                        />
                      )}

                      {hasFlyer ? (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md">
                          <img
                            src={event.imageUrl!}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl sm:text-4xl shadow-md border border-white/20 dark:border-white/10 select-none"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                          }}
                        >
                          {event.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </motion.div>

                    <h4
                      className={`font-display text-sm sm:text-base font-bold mb-1.5 line-clamp-1 ${
                        dark ? "text-cream" : "text-navy"
                      }`}
                    >
                      {event.title}
                    </h4>
                    <p className="font-body text-xs font-semibold text-amber mb-1.5 uppercase tracking-wide">
                      {event.category}
                    </p>

                    <div className={`font-body text-[11px] leading-relaxed space-y-1.5 ${
                      dark ? "text-cream/50" : "text-navy/60"
                    }`}>
                      <p className="flex items-center justify-center gap-1.5">
                        <Calendar size={12} className="text-amber shrink-0" />
                        <span>
                          {new Date(event.startsAt).toLocaleDateString("en-KE", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                      <p className="flex items-center justify-center gap-1.5">
                        <MapPin size={12} className="text-amber shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                      <p className="font-semibold text-amber/90 pt-0.5">
                        {event.type === "PAID" ? `KES ${event.priceKes.toLocaleString()}` : "FREE RSVP"}
                      </p>
                    </div>
                  </div>
                </ClickableCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

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
