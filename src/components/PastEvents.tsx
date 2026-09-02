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
import { Images } from "./icons";

export interface PastEventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  date?: string;
  location?: string;
  attendanceCount?: number | null;
  coverImageUrl?: string;
  galleryUrls: string[];
  highlights?: string[];
  keyTakeaways?: string[];
  speakers?: string[];
  partnerName?: string | null;
  testimonial?: string | null;
  testimonialAuthor?: string | null;
  status: string;
}

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
              className="w-full h-full flex items-center justify-center text-teal font-display font-bold text-5xl select-none bg-gradient-to-br from-amber to-gold"
            >
              {event.title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-cream">
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">
              {event.title}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Description */}
      <div>
        <h4
          className={`font-display text-xs uppercase font-bold tracking-wider mb-2 ${
            dark ? "text-amber" : "text-gold"
          }`}
        >
          Event Overview
        </h4>
        <p
          className={`font-body text-sm leading-relaxed ${
            dark ? "text-cream/80" : "text-navy/85"
          }`}
        >
          {event.description}
        </p>
      </div>

      {/* 3. Photo Gallery Grid with Lightbox Launch */}
      {event.galleryUrls && event.galleryUrls.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4
              className={`font-display text-xs uppercase font-bold tracking-wider flex items-center gap-2 ${
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
          // Deep-link support: /events/past?event=<slug> opens that event's modal.
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const slug = params.get("event");
            if (slug) {
              const match = data.find((e: PastEventData) => e.slug === slug);
              if (match) setSelectedEvent(match);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load past events:", err);
        setLoading(false);
      });
  }, []);

  const openLightboxForEvent = (event: PastEventData, initialIdx: number = 0) => {
    const imgs = event.galleryUrls && event.galleryUrls.length > 0 ? event.galleryUrls : (event.coverImageUrl ? [event.coverImageUrl] : []);
    setLightboxImages(imgs);
    setLightboxIndex(initialIdx);
    setLightboxTitle(event.title);
    setLightboxOpen(true);
  };

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
            Past Events & <span className="text-amber">Gallery</span>
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-16 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Relive past Strathmore Marketing Club moments. Explore event highlights and photo galleries.
          </p>
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
            {events.map((event) => {
              const photoCount = event.galleryUrls?.length || (event.coverImageUrl ? 1 : 0);

              return (
                <StaggerItem key={event.id} y={40}>
                  <ClickableCard
                    onClick={() => setSelectedEvent(event)}
                    cue="View gallery & details"
                    className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,168,41,0.12)] dark:hover:shadow-[0_20px_40px_rgba(255,168,41,0.18)]"
                  >
                    <div className="p-5 sm:p-6 pb-6 flex flex-col justify-between h-full">
                      <div>
                        {/* Event Cover Photo */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-cream/10 bg-navy/80 shadow-sm">
                          {event.coverImageUrl ? (
                            <img
                              src={event.coverImageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-teal font-display font-bold text-4xl select-none bg-gradient-to-br from-amber to-gold"
                            >
                              {event.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {photoCount > 0 && (
                            <div className="absolute bottom-3 right-3 z-10">
                              <span className="flex items-center gap-1.5 bg-black/80 text-white text-[10px] font-body font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15 shadow-sm">
                                <Images size={12} className="text-amber" />
                                <span>{photoCount} {photoCount === 1 ? "Photo" : "Photos"}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Excerpt */}
                        <h3
                          className={`font-display text-lg sm:text-xl font-bold mb-2 line-clamp-2 group-hover:text-amber transition-colors ${
                            dark ? "text-cream" : "text-navy"
                          }`}
                        >
                          {event.title}
                        </h3>

                        <p
                          className={`font-body text-xs sm:text-sm line-clamp-3 leading-relaxed ${
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
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!loading && events.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              No past events found in the archives.
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

