"use client";

import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import { CheckCircle2 } from "./icons";

/* ── Types ──────────────────────────────────────────────── */
interface ApiEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
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

  const hasFlyer = !!event.imageUrl;

  return (
    <div className="pr-4">
      {/* 1. Header with flyer & title */}
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
            className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border border-white/10 shadow-lg shrink-0"
          />
        ) : (
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-teal font-display font-bold text-4xl sm:text-5xl shadow-md border border-white/10 select-none bg-gradient-to-br from-amber to-gold shrink-0"
          >
            {event.title.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center sm:text-left">
          <h3
            className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            {event.title}
          </h3>
        </div>
      </motion.div>

      {/* 2. Description */}
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className={`font-body text-sm leading-relaxed mb-6 ${
          dark ? "text-cream/80" : "text-navy/85"
        }`}
      >
        {event.description}
      </motion.p>

      {/* 3. RSVP Form */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={contentVariants}>
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

/* ── Main Events Component ───────────────────────────── */
export default function Events() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

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

        {/* Main Heading */}
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
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-16 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Explore upcoming events designed to expand your creative horizons. Click any event to learn more and register.
          </p>
        </Reveal>

        {/* Event cards grid */}
        <div className="mt-12">
          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            stagger={0.08}
          >
            {events.map((event) => {
              const hasFlyer = !!event.imageUrl;

              return (
                <StaggerItem key={event.id} y={40}>
                  <ClickableCard
                    onClick={() => setSelectedEvent(event)}
                    cue="View details & register"
                    className="h-full transition-all duration-300 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] dark:hover:shadow-[0_16px_32px_rgba(255,168,41,0.15)]"
                  >
                    <div
                      className="p-6 sm:p-8 text-center flex flex-col justify-between h-full"
                      onMouseEnter={() => setHoveredId(event.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div>
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
                                background: `radial-gradient(circle, rgba(255,168,41,0.6) 0%, rgba(204,136,2,0.4) 100%)`,
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
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-teal font-display font-bold text-3xl sm:text-4xl shadow-md border border-white/20 dark:border-white/10 select-none bg-gradient-to-br from-amber to-gold"
                            >
                              {event.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </motion.div>

                        <h4
                          className={`font-display text-base sm:text-lg font-bold mb-2.5 line-clamp-2 ${
                            dark ? "text-cream" : "text-navy"
                          }`}
                        >
                          {event.title}
                        </h4>

                        <p
                          className={`font-body text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                            dark ? "text-cream/65" : "text-navy/70"
                          }`}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </ClickableCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {events.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              No upcoming events scheduled right now. Check back soon!
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

