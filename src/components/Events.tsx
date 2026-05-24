"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import Countdown from "./ui/Countdown";
import { useTheme } from "./ThemeProvider";
import { events, eventTags, getNextEvent, type EventItem, type EventTag } from "@/data/events";

/* ── Event Detail Modal Content ──────────────────────── */
function EventDetail({
  event,
  rsvpd,
  onRsvp,
}: {
  event: EventItem;
  rsvpd: boolean;
  onRsvp: () => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const spotsLeft = event.spotsTotal - event.spotsTaken - (rsvpd ? 1 : 0);

  return (
    <div className="pr-6">
      <span className="inline-block font-body text-xs font-semibold tracking-widest uppercase bg-amber/10 text-amber px-3 py-1 rounded-full mb-4">
        {event.tag}
      </span>
      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {event.title}
      </h3>

      <div className={`flex flex-wrap gap-x-5 gap-y-1 font-body text-sm mb-5 ${
        dark ? "text-cream/50" : "text-navy/50"
      }`}>
        <span>{event.date}</span>
        <span>{event.time}</span>
        <span>{event.location}</span>
      </div>

      <p className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
        dark ? "text-cream/70" : "text-navy/70"
      }`}>
        {event.longDesc}
      </p>

      {/* Host */}
      <div className="mb-5">
        <p className={`font-body text-xs font-semibold tracking-widest uppercase mb-2 ${
          dark ? "text-cream/40" : "text-navy/40"
        }`}>
          Hosted by
        </p>
        <p className={`font-body font-medium ${dark ? "text-cream" : "text-navy"}`}>
          {event.host}
        </p>
      </div>

      {/* Agenda */}
      <div className="mb-6">
        <p className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
          dark ? "text-cream/40" : "text-navy/40"
        }`}>
          Agenda
        </p>
        <ul className="space-y-2">
          {event.agenda.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1 w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                <span className="text-amber font-body text-[10px] font-bold">{i + 1}</span>
              </span>
              <span className={`font-body text-sm leading-relaxed ${
                dark ? "text-cream/65" : "text-navy/80"
              }`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* RSVP / spots */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <motion.button
          onClick={onRsvp}
          disabled={rsvpd}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
            rsvpd
              ? "bg-green-500/20 text-green-400 cursor-default"
              : "bg-amber text-teal hover:bg-gold"
          }`}
          whileTap={rsvpd ? {} : { scale: 0.95 }}
        >
          {rsvpd ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Reserved
            </>
          ) : (
            "Register Now"
          )}
        </motion.button>
        <span className={`font-body text-sm ${dark ? "text-cream/40" : "text-navy/40"}`}>
          {Math.max(0, spotsLeft)} spots left
        </span>
      </div>
    </div>
  );
}

/* ── Marquee ticker ──────────────────────────────────── */
function EventMarquee() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const items = events.map((e) => `${e.title} — ${e.date}`);
  const joined = items.join("   •   ");

  if (prefersReduced) {
    return (
      <div className={`overflow-hidden py-3 border-y ${
        dark ? "border-cream/5" : "border-navy/5"
      }`}>
        <p className={`font-body text-xs tracking-wide ${dark ? "text-cream/30" : "text-navy/30"}`}>
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
            className={`font-body text-xs tracking-wide mr-8 group-hover:[animation-play-state:paused] ${
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

  const [activeFilter, setActiveFilter] = useState<EventTag>("All");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [rsvpMap, setRsvpMap] = useState<Record<string, boolean>>({});

  const nextEvent = useMemo(() => getNextEvent(), []);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? events
        : events.filter((e) => e.tag === activeFilter),
    [activeFilter],
  );

  const handleRsvp = (id: string) => {
    setRsvpMap((prev) => ({ ...prev, [id]: true }));
  };

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
        <Reveal delay={0.1}>
          <div className="mb-8 sm:mb-10 max-w-md mx-auto sm:mx-0">
            <Countdown targetDate={nextEvent.isoDate} label={nextEvent.title} />
          </div>
          <EventMarquee />
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-2 mt-8 sm:mt-10 mb-6 sm:mb-8">
            {eventTags.map((tag) => (
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

        {/* Event cards grid — animated layout */}
        <motion.div layout className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
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
                        {event.tag}
                      </motion.span>
                      <span
                        className={`font-body text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          event.spotsTotal - event.spotsTaken - (rsvpMap[event.id] ? 1 : 0) <= 10
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {Math.max(0, event.spotsTotal - event.spotsTaken - (rsvpMap[event.id] ? 1 : 0))} spots
                      </span>
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
                      {event.date}
                    </p>
                    <p
                      className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
                        dark ? "text-cream/65" : "text-navy/80"
                      }`}
                    >
                      {event.desc}
                    </p>

                    {/* Location + time row */}
                    <div className={`flex flex-wrap gap-x-4 gap-y-1 font-body text-xs ${
                      dark ? "text-cream/30" : "text-navy/30"
                    }`}>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {event.time}
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
            event={selectedEvent}
            rsvpd={!!rsvpMap[selectedEvent.id]}
            onRsvp={() => handleRsvp(selectedEvent.id)}
          />
        )}
      </DetailModal>
    </section>
  );
}
