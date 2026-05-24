"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import {
  projects,
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/data/portfolio";

/* ── Case study detail content ───────────────────────── */
function CaseStudyDetail({ project }: { project: Project }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const sections = [
    { label: "Problem", text: project.problem },
    { label: "Approach", text: project.approach },
    { label: "Outcome", text: project.outcome },
  ];

  return (
    <div className="pr-4">
      <span
        className={`inline-block font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
          dark ? "text-gold" : "text-amber"
        }`}
      >
        {project.category}
      </span>
      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {project.title}
      </h3>
      <p
        className={`font-body text-sm mb-6 ${
          dark ? "text-cream/50" : "text-navy/60"
        }`}
      >
        Duration: {project.duration} &middot; Team of {project.team.length}
      </p>

      {/* Problem / Approach / Outcome */}
      <div className="space-y-5 mb-6">
        {sections.map((s) => (
          <div key={s.label}>
            <p
              className={`font-body text-xs font-semibold tracking-widest uppercase mb-2 ${
                dark ? "text-cream/40" : "text-navy/50"
              }`}
            >
              {s.label}
            </p>
            <p
              className={`font-body text-sm sm:text-base leading-relaxed ${
                dark ? "text-cream/70" : "text-navy/80"
              }`}
            >
              {s.text}
            </p>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <p
          className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
            dark ? "text-cream/40" : "text-navy/50"
          }`}
        >
          Key Metrics
        </p>
        <div className="flex flex-wrap gap-2">
          {project.metrics.map((m) => (
            <span
              key={m}
              className="font-body text-xs font-semibold px-3 py-1.5 rounded-full bg-amber/10 text-amber"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <p
          className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
            dark ? "text-cream/40" : "text-navy/50"
          }`}
        >
          Team
        </p>
        <p
          className={`font-body text-sm ${
            dark ? "text-cream/60" : "text-navy/70"
          }`}
        >
          {project.team.join(", ")}
        </p>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Portfolio() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter],
  );

  return (
    <section
      id="portfolio"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="diagonals" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Portfolio
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Our <span className="text-amber">Work</span>
          </h2>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-10 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Real projects. Real brands. Real results. Click any project to see
            the full case study.
          </p>
        </Reveal>

        {/* Category filter tabs */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {projectCategories.map((cat) => (
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
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Project cards grid */}
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
                <ClickableCard
                  onClick={() => setSelected(p)}
                  cue="View case study"
                >
                  <div className="p-5 sm:p-7">
                    <span
                      className={`inline-block font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
                        dark ? "text-gold" : "text-amber"
                      }`}
                    >
                      {p.category}
                    </span>
                    <h3
                      className={`font-display text-base sm:text-lg font-bold mb-2 sm:mb-3 leading-snug ${
                        dark ? "text-cream" : "text-navy"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <p
                      className={`font-body text-sm leading-relaxed mb-4 ${
                        dark ? "text-cream/60" : "text-navy/75"
                      }`}
                    >
                      {p.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.metrics.slice(0, 2).map((m) => (
                        <span
                          key={m}
                          className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber/10 text-amber"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </ClickableCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center font-body py-16 ${
                dark ? "text-cream/40" : "text-navy/50"
              }`}
            >
              No projects in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        {selected && <CaseStudyDetail project={selected} />}
      </DetailModal>
    </section>
  );
}
