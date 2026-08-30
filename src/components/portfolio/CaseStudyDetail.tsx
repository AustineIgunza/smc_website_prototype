"use client";

import { useTheme } from "../ThemeProvider";
import { Sparkles, ExternalLink } from "../icons";
import { getProjectCategoryLabel } from "@/data/projectCategories";

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
  duration: string | null;
  status: string;
  featured: boolean;
  coverImageUrl: string | null;
  liveUrl: string | null;
  testimonial: string | null;
  testimonialAuthor: string | null;
}

/* ── Case study detail body ───────────────────────────── */
export default function CaseStudyDetail({ project }: { project: Project }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Not every project has a full narrative — only render sections with copy.
  const sections = [
    { label: "Problem", text: project.problem },
    { label: "Approach", text: project.approach },
    { label: "Outcome", text: project.outcome },
  ].filter((s) => s.text?.trim());

  const team = project.team ?? [];
  const metrics = project.metrics ?? [];
  const tags = project.tags ?? [];

  const meta = [
    project.duration,
    team.length > 0 ? `Team of ${team.length}` : null,
  ].filter(Boolean);

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
          {getProjectCategoryLabel(project.category)}
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
          <span className="text-amber text-xs ml-auto inline-flex items-center gap-1">
            <Sparkles size={11} className="shrink-0" />
            <span>Featured</span>
          </span>
        )}
      </div>

      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {project.title}
      </h3>

      {meta.length > 0 && (
        <p
          className={`font-body text-sm mb-6 ${
            dark ? "text-cream/50" : "text-navy/60"
          }`}
        >
          {meta.join(" · ")}
        </p>
      )}

      {/* Overview — always present, and the only copy some projects have */}
      <p
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {project.desc}
      </p>

      {/* Problem / Approach / Outcome */}
      {sections.length > 0 && (
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
      )}

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="mb-6">
          <p
            className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
              dark ? "text-cream/40" : "text-navy/50"
            }`}
          >
            Key Metrics
          </p>
          <div className="flex flex-wrap gap-2">
            {metrics.map((m) => (
              <span
                key={m}
                className="font-body text-xs font-semibold px-3 py-1.5 rounded-full bg-amber/10 text-amber"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-6">
          <p
            className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
              dark ? "text-cream/40" : "text-navy/50"
            }`}
          >
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
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
      {team.length > 0 && (
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
            {team.join(", ")}
          </p>
        </div>
      )}

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
              {project.testimonialAuthor}
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
          <span>View live work</span>
          <ExternalLink size={14} className="shrink-0" />
        </a>
      )}
    </div>
  );
}
