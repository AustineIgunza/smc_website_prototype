"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  clientName: string | null;
  desc: string;
  problem: string;
  approach: string;
  outcome: string;
  metrics: string[];
  team: string[];
  tags: string[];
  duration: string;
  status: string;
  featured: boolean;
  coverImageUrl: string | null;
  liveUrl: string | null;
  testimonial: string | null;
  testimonialAuthor: string | null;
}

/* ── Case study modal content ─────────────────────────── */
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
      {/* Cover image */}
      {project.coverImageUrl && (
        <div
          className="w-full h-40 sm:h-52 rounded-xl bg-cover bg-center mb-6 -mt-1"
          style={{ backgroundImage: `url(${project.coverImageUrl})` }}
        />
      )}

      {/* Category + client */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span
          className={`font-body text-xs font-semibold tracking-widest uppercase ${
            dark ? "text-gold" : "text-amber"
          }`}
        >
          {project.category}
        </span>
        {project.clientName && (
          <>
            <span className={dark ? "text-cream/20" : "text-navy/20"}>·</span>
            <span className={`font-body text-xs ${dark ? "text-cream/50" : "text-navy/60"}`}>
              {project.clientName}
            </span>
          </>
        )}
        {project.featured && (
          <span className="text-amber text-xs ml-auto">★ Featured</span>
        )}
      </div>

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
        {project.duration} &middot; Team of {(project.team ?? []).length}
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
          {(project.metrics ?? []).map((m) => (
            <span
              key={m}
              className="font-body text-xs font-semibold px-3 py-1.5 rounded-full bg-amber/10 text-amber"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {(project.tags ?? []).length > 0 && (
        <div className="mb-6">
          <p
            className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
              dark ? "text-cream/40" : "text-navy/50"
            }`}
          >
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {(project.tags ?? []).map((t) => (
              <span
                key={t}
                className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full ${
                  dark ? "bg-cream/10 text-cream/60" : "bg-navy/5 text-navy/60"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      <div className={project.testimonial ? "mb-6" : ""}>
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
          {(project.team ?? []).join(", ")}
        </p>
      </div>

      {/* Testimonial */}
      {project.testimonial && (
        <div
          className={`rounded-xl p-4 sm:p-5 border-l-2 border-amber mb-6 ${
            dark ? "bg-cream/5" : "bg-navy/5"
          }`}
        >
          <p
            className={`font-body text-sm sm:text-base leading-relaxed italic mb-3 ${
              dark ? "text-cream/70" : "text-navy/75"
            }`}
          >
            &ldquo;{project.testimonial}&rdquo;
          </p>
          {project.testimonialAuthor && (
            <p className={`font-body text-xs font-semibold ${dark ? "text-cream/40" : "text-navy/50"}`}>
              — {project.testimonialAuthor}
            </p>
          )}
        </div>
      )}

      {/* Live work CTA */}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all"
        >
          View live work
          <span className="text-xs">↗</span>
        </a>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Portfolio() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...cats];
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
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="text-amber text-[10px] uppercase font-semibold tracking-wider bg-amber/5 px-2 py-0.5 rounded border border-amber/10">
                            ★ Featured
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
                      <p>Duration: {p.duration}</p>
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
