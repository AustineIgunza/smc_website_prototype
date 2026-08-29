"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reveal, { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import PhotoLightbox from "./ui/PhotoLightbox";
import { useTheme } from "./ThemeProvider";
import {
  Calendar,
  MapPin,
  Users,
  Images,
  Award,
  Sparkles,
  Tag,
  CheckCircle2,
  Share2,
  ExternalLink,
} from "./icons";

export interface PastEventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  attendanceCount: number | null;
  coverImageUrl: string;
  galleryUrls: string[];
  highlights: string[];
  keyTakeaways: string[];
  speakers: string[];
  partnerName?: string | null;
  testimonial?: string | null;
  testimonialAuthor?: string | null;
  status: string;
}

import {
  getCategoryGradient,
  getCategoryBadgeStyle,
  EVENT_CATEGORIES,
} from "@/data/eventCategories";

/* ── Modal Content Component ───────────────────────────────── */
function PastEventDetail({
  event,
  onOpenLightbox,
}: {
  event: PastEventData;
  onOpenLightbox: (initialIndex: number) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const colors = getCategoryGradient(event.category);

  return (
    <div className="space-y-6 pr-2">
      {/* 1. Header with Cover & Title */}
      <div className="relative rounded-2xl overflow-hidden border border-cream/10 bg-navy/40">
        <div className="h-48 sm:h-64 w-full relative">
          {event.coverImageUrl ? (
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-display font-bold text-5xl select-none"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              }}
            >
              {event.title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-cream">
            <span className="inline-block font-body text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber text-teal mb-2">
              {event.category}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">
              {event.title}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Key Metadata Strip */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl border ${
          dark ? "bg-cream/5 border-cream/10 text-cream" : "bg-navy/5 border-navy/10 text-navy"
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-amber shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-amber uppercase tracking-wider">Date</p>
            <p className="text-xs font-body">
              {new Date(event.date).toLocaleDateString("en-KE", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-amber shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-amber uppercase tracking-wider">Venue</p>
            <p className="text-xs font-body truncate">{event.location}</p>
          </div>
        </div>

        {event.attendanceCount && (
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Users size={16} className="text-amber shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-amber uppercase tracking-wider">Turnout</p>
              <p className="text-xs font-body font-bold">{event.attendanceCount}+ Marketers</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Description */}
      <div>
        <h4
          className={`font-display text-sm uppercase font-bold tracking-wider mb-2 ${
            dark ? "text-amber" : "text-gold"
          }`}
        >
          Event Overview
        </h4>
        <p
          className={`font-body text-sm leading-relaxed ${
            dark ? "text-cream/70" : "text-navy/80"
          }`}
        >
          {event.description}
        </p>
      </div>

      {/* 4. Highlights */}
      {event.highlights && event.highlights.length > 0 && (
        <div className="space-y-2">
          <h4
            className={`font-display text-sm uppercase font-bold tracking-wider ${
              dark ? "text-amber" : "text-gold"
            }`}
          >
            Key Highlights
          </h4>
          <ul className="space-y-1.5">
            {event.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 text-xs font-body ${
                  dark ? "text-cream/80" : "text-navy/85"
                }`}
              >
                <CheckCircle2 size={14} className="text-amber shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Key Takeaways */}
      {event.keyTakeaways && event.keyTakeaways.length > 0 && (
        <div
          className={`p-4 rounded-xl border-l-4 border-amber ${
            dark ? "bg-amber/5 border-y border-r border-cream/10" : "bg-amber/10 border-y border-r border-navy/10"
          }`}
        >
          <p className="font-display text-xs uppercase font-bold tracking-widest text-amber mb-2">
            Strategic Takeaways
          </p>
          <ul className="space-y-1.5">
            {event.keyTakeaways.map((item, idx) => (
              <li
                key={idx}
                className={`text-xs font-body leading-relaxed ${
                  dark ? "text-cream/80" : "text-navy/85"
                }`}
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Speakers & Partners */}
      {event.speakers && event.speakers.length > 0 && (
        <div>
          <h4
            className={`font-display text-sm uppercase font-bold tracking-wider mb-2 ${
              dark ? "text-amber" : "text-gold"
            }`}
          >
            Guest Speakers & Mentors
          </h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {event.speakers.map((speaker, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg text-xs font-body border ${
                  dark ? "bg-cream/5 border-cream/10 text-cream/80" : "bg-navy/5 border-navy/10 text-navy/80"
                }`}
              >
                {speaker}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Testimonial */}
      {event.testimonial && (
        <div
          className={`p-4 rounded-xl border italic ${
            dark
              ? "bg-teal/30 border-cream/10 text-cream/70"
              : "bg-navy/5 border-navy/10 text-navy/70"
          }`}
        >
          <p className="font-body text-xs leading-relaxed">&ldquo;{event.testimonial}&rdquo;</p>
          {event.testimonialAuthor && (
            <p className="font-body text-[11px] font-semibold text-amber not-italic mt-2">
              — {event.testimonialAuthor}
            </p>
          )}
        </div>
      )}

      {/* 8. Photo Gallery Grid with Lightbox Launch */}
      {event.galleryUrls && event.galleryUrls.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4
              className={`font-display text-sm uppercase font-bold tracking-wider flex items-center gap-2 ${
                dark ? "text-amber" : "text-gold"
              }`}
            >
              <Images size={16} />
              Photo Gallery ({event.galleryUrls.length})
            </h4>
            <span
              className={`text-[11px] font-body ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              Click any photo to expand
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {event.galleryUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onOpenLightbox(idx)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-cream/10 focus:outline-none focus:ring-2 focus:ring-amber cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Event picture ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Images size={18} className="text-amber" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main PastEvents Component ─────────────────────────────── */
export default function PastEvents() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [events, setEvents] = useState<PastEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

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
  const [selectedEvent, setSelectedEvent] = useState<PastEventData | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState("");

  useEffect(() => {
    fetch("/api/past-events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load past events:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return events;
    return events.filter((e) => e.category === activeCategory);
  }, [activeCategory, events]);

  const openLightboxForEvent = (event: PastEventData, initialIdx: number = 0) => {
    const imgs = event.galleryUrls && event.galleryUrls.length > 0 ? event.galleryUrls : [event.coverImageUrl];
    setLightboxImages(imgs);
    setLightboxIndex(initialIdx);
    setLightboxTitle(event.title);
    setLightboxOpen(true);
  };

  const totalAttendees = useMemo(() => {
    return events.reduce((acc, curr) => acc + (curr.attendanceCount || 0), 0);
  }, [events]);

  const totalPhotos = useMemo(() => {
    return events.reduce((acc, curr) => acc + (curr.galleryUrls?.length || 1), 0);
  }, [events]);

  return (
    <section
      id="past-events"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-16 sm:pb-28 ${
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
              <Link
                href="/events"
                className={`px-5 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-all ${
                  dark
                    ? "text-cream/60 hover:text-cream"
                    : "text-navy/60 hover:text-navy"
                }`}
              >
                Upcoming Events
              </Link>
              <span className="px-5 py-2 rounded-full font-body text-xs font-semibold tracking-wide bg-amber text-teal shadow-md">
                Past Events & Gallery
              </span>
            </div>
          </div>
        </Reveal>

        {/* Hero Display Header */}
        <Reveal y={40} delay={0.1}>
          <h1 className="font-accent text-amber text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-4 tracking-wide">
            Archives
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Past Events & <span className="text-amber">Highlights</span>
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-10 sm:mb-14 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Relive the defining moments of Strathmore Marketing Club. Explore keynote insights,
            hackathon pitches, agency tours, and photo galleries.
          </p>
        </Reveal>

        {/* Impact Stats Ribbon */}
        <Reveal y={30} delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
            <div
              className={`p-5 rounded-2xl border text-center backdrop-blur-sm ${
                dark ? "bg-navy/60 border-cream/10" : "bg-navy/5 border-navy/10"
              }`}
            >
              <p className="font-display text-3xl font-bold text-amber mb-1">
                {events.length}+
              </p>
              <p className="font-body text-xs uppercase font-semibold tracking-wider text-cream/50 dark:text-cream/50">
                Major Events
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center backdrop-blur-sm ${
                dark ? "bg-navy/60 border-cream/10" : "bg-navy/5 border-navy/10"
              }`}
            >
              <p className="font-display text-3xl font-bold text-amber mb-1">
                {totalAttendees}+
              </p>
              <p className="font-body text-xs uppercase font-semibold tracking-wider text-cream/50 dark:text-cream/50">
                Attendees Reached
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center backdrop-blur-sm ${
                dark ? "bg-navy/60 border-cream/10" : "bg-navy/5 border-navy/10"
              }`}
            >
              <p className="font-display text-3xl font-bold text-amber mb-1">
                {totalPhotos}+
              </p>
              <p className="font-body text-xs uppercase font-semibold tracking-wider text-cream/50 dark:text-cream/50">
                Photo Gallery
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center backdrop-blur-sm ${
                dark ? "bg-navy/60 border-cream/10" : "bg-navy/5 border-navy/10"
              }`}
            >
              <p className="font-display text-3xl font-bold text-amber mb-1">
                100%
              </p>
              <p className="font-body text-xs uppercase font-semibold tracking-wider text-cream/50 dark:text-cream/50">
                Industry Polish
              </p>
            </div>
          </div>
        </Reveal>

        {/* Category Filters */}
        <Reveal y={20} delay={0.2}>
          <div className="flex items-center gap-4 mb-6">
            <h3
              className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${
                dark ? "text-amber" : "text-gold"
              }`}
            >
              Filter by Category
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {filterCategories.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={`px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === tag
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

        {/* Past Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className={`font-body ${dark ? "text-cream/40" : "text-navy/40"}`}>
              Loading past events & gallery...
            </p>
          </div>
        ) : (
          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            stagger={0.08}
          >
            {filtered.map((event) => {
              const colors = getCategoryGradient(event.category);
              const photoCount = event.galleryUrls?.length || (event.coverImageUrl ? 1 : 0);

              return (
                <StaggerItem key={event.id} y={40}>
                  <ClickableCard
                    onClick={() => setSelectedEvent(event)}
                    cue="View recap"
                    className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,168,41,0.12)] dark:hover:shadow-[0_20px_40px_rgba(255,168,41,0.18)]"
                  >
                    <div className="p-5 sm:p-6 pb-9 sm:pb-10 flex flex-col justify-between h-full">
                      <div>
                        {/* Event Cover Photo with Overlay Badges */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-cream/10 bg-navy/80 shadow-sm">
                          {event.coverImageUrl ? (
                            <img
                              src={event.coverImageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-white font-display font-bold text-4xl select-none"
                              style={{
                                backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                              }}
                            >
                              {event.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="font-body text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber text-teal shadow-md backdrop-blur-md">
                              {event.category}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3 z-10">
                            <span className="flex items-center gap-1.5 bg-black/80 text-white text-[10px] font-body font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15 shadow-sm">
                              <Images size={12} className="text-amber" />
                              <span>{photoCount} Photos</span>
                            </span>
                          </div>
                        </div>

                        {/* Title & Excerpt */}
                        <h3
                          className={`font-display text-lg sm:text-xl font-bold mb-2 line-clamp-1 group-hover:text-amber transition-colors ${
                            dark ? "text-cream" : "text-navy"
                          }`}
                        >
                          {event.title}
                        </h3>

                        <p
                          className={`font-body text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 ${
                            dark ? "text-cream/65" : "text-navy/70"
                          }`}
                        >
                          {event.description}
                        </p>

                        {/* Optional Partner Row */}
                        {event.partnerName && (
                          <p className="font-body text-[11px] text-amber/90 font-medium mb-3 truncate flex items-center gap-1">
                            <Sparkles size={11} className="text-amber shrink-0" />
                            <span>With {event.partnerName}</span>
                          </p>
                        )}
                      </div>

                      {/* Metadata Footer */}
                      <div
                        className={`pt-3.5 border-t font-body text-xs flex items-center justify-between mt-auto transition-opacity duration-200 group-hover:opacity-40 ${
                          dark ? "border-cream/10 text-cream/60" : "border-navy/10 text-navy/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-amber shrink-0" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-KE", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {event.attendanceCount && (
                            <div className="flex items-center gap-1 text-amber font-semibold">
                              <Users size={13} className="shrink-0" />
                              <span>{event.attendanceCount}+</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 truncate max-w-[110px] sm:max-w-[130px]">
                            <MapPin size={12} className="text-amber/70 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ClickableCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!loading && filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              No past events found in this category.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Event Details & Gallery Modal */}
      <DetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <PastEventDetail
            key={selectedEvent.id}
            event={selectedEvent}
            onOpenLightbox={(idx) => openLightboxForEvent(selectedEvent, idx)}
          />
        )}
      </DetailModal>

      {/* Lightbox for high-resolution images */}
      <PhotoLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        title={lightboxTitle}
      />
    </section>
  );
}
