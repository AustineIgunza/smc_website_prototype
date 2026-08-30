"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import CaseStudyDetail, { type Project } from "./portfolio/CaseStudyDetail";
import { useTheme } from "./ThemeProvider";
import { Sparkles, ArrowRight } from "./icons";
import {
  PROJECT_CATEGORIES,
  getProjectCategoryLabel,
} from "@/data/projectCategories";
import PartnershipsSection from "./portfolio/PartnershipsSection";
import type { PartnershipsContent } from "@/data/partnerships";

export type { Project };

/* ── Loading skeleton card ────────────────────────────── */
function SkeletonCard({ dark }: { dark: boolean }) {
  const block = dark ? "bg-cream/10" : "bg-navy/10";
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 ${
        dark ? "border-cream/10" : "border-navy/10"
      }`}
    >
      <div className="animate-pulse flex flex-col items-center">
        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl mb-5 ${block}`} />
        <div className={`h-2 w-24 rounded-full mb-3 ${block}`} />
        <div className={`h-3 w-40 rounded-full mb-3 ${block}`} />
        <div className={`h-2 w-full rounded-full mb-2 ${block}`} />
        <div className={`h-2 w-4/5 rounded-full mb-6 ${block}`} />
        <div className={`h-[1px] w-full mb-4 ${block}`} />
        <div className={`h-2 w-32 rounded-full ${block}`} />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Portfolio({
  partnershipsContent,
}: {
  partnershipsContent?: PartnershipsContent;
} = {}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: Project[] = await res.json();
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setError("We couldn't load our work right now. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter chips come from the shared taxonomy, in config order — only
  // showing categories that actually have published projects behind them.
  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return [
      "All",
      ...PROJECT_CATEGORIES.filter((c) => present.has(c.id)).map((c) => c.id),
    ];
  }, [projects]);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter, projects],
  );

  return (
    <section
      id="portfolio"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal y={40}>
          <h1 className="font-accent text-amber text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-4 tracking-wide">
            Portfolio
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Our <span className="text-amber">Work</span>
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-20 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Real projects. Real brands. Real results. Click any project to see
            the full case study.
          </p>
        </Reveal>

        <Reveal y={40} delay={0.15}>
          <div className="flex items-center gap-4 mt-12 mb-6">
            <h3 className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${dark ? "text-amber" : "text-gold"}`}>
              Project Categories
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>
        </Reveal>

        {/* Category filter tabs */}
        {!loading && !error && categories.length > 1 && (
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    activeFilter === cat
                      ? "bg-amber text-teal"
                      : dark
                        ? "bg-cream/5 text-cream/60 hover:bg-cream/10"
                        : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                  }`}
                >
                  {cat === "All" ? "All" : getProjectCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} dark={dark} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className={`rounded-2xl border px-6 py-12 text-center ${
              dark
                ? "border-cream/10 bg-cream/5"
                : "border-navy/10 bg-navy/5"
            }`}
          >
            <p
              className={`font-body text-sm sm:text-base mb-4 ${
                dark ? "text-cream/70" : "text-navy/75"
              }`}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Project cards grid */}
        {!loading && !error && (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ClickableCard onClick={() => setSelected(p)} cue="View case study">
                    <div className="p-6 sm:p-8 text-center flex flex-col justify-between h-full">
                      <div>
                        {/* Cover image or fallback */}
                        <div className="mx-auto mb-5 w-fit relative">
                          {p.coverImageUrl ? (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105">
                              <img
                                src={p.coverImageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cream/5 border border-white/20 dark:border-white/10 flex items-center justify-center select-none transition-transform duration-300 group-hover:scale-105">
                              <span className="font-display text-2xl text-cream/20 font-bold">
                                {p.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category + featured */}
                        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`font-body text-[10px] font-semibold tracking-widest uppercase ${
                              dark ? "text-gold" : "text-amber"
                            }`}
                          >
                            {getProjectCategoryLabel(p.category)}
                          </span>
                          {p.featured && (
                            <span className="text-amber text-[10px] uppercase font-semibold tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10 inline-flex items-center gap-1">
                              <Sparkles size={10} className="shrink-0" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-display text-sm sm:text-base font-bold mb-2 line-clamp-1 group-hover:text-amber transition-colors ${
                            dark ? "text-cream" : "text-navy"
                          }`}
                        >
                          {p.title}
                        </h3>

                        <p
                          className={`font-body text-xs leading-relaxed mb-4 line-clamp-2 ${
                            dark ? "text-cream/60" : "text-navy/75"
                          }`}
                        >
                          {p.desc}
                        </p>
                      </div>

                      {/* Footer / Info */}
                      <div className="pt-4 border-t border-cream/5 font-body text-[11px] text-cream/50 space-y-1">
                        {p.clientName && <p>Client: {p.clientName}</p>}
                        {p.duration && <p>Duration: {p.duration}</p>}
                        <div className="flex flex-wrap justify-center gap-1.5 pt-2 mt-1">
                          {(p.metrics ?? []).slice(0, 2).map((m) => (
                            <span
                              key={m}
                              className="font-body text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/15"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ClickableCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {!loading && !error && filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/50"
              }`}
            >
              {projects.length === 0
                ? "Our case studies are on their way — check back soon."
                : "No projects in this category yet."}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Partnerships Section ────────────────────────── */}
        <PartnershipsSection content={partnershipsContent} />
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        {selected && (
          <>
            <CaseStudyDetail project={selected} />
            <div className="pr-4 mt-6">
              <Link
                href={`/portfolio/${selected.slug}`}
                className={`inline-flex items-center gap-1.5 font-body text-sm font-semibold transition-colors ${
                  dark
                    ? "text-amber hover:text-amber/80"
                    : "text-gold hover:text-amber"
                }`}
              >
                <span>View full case study page</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            </div>
          </>
        )}
      </DetailModal>
    </section>
  );
}
