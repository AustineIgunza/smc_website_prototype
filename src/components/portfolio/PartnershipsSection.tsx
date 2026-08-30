"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal, { StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { useTheme } from "@/components/ThemeProvider";
import {
  DEFAULT_PARTNERSHIPS_CONTENT,
  type PartnershipsContent,
} from "@/data/partnerships";
import {
  Globe,
  Award,
  Users,
  Target,
  Sparkles,
  Briefcase,
  Layers,
  CheckCircle2,
} from "@/components/icons";

interface PartnershipsSectionProps {
  content?: PartnershipsContent;
}

// Brand visual accent colors for the corporate partners
const PARTNER_ACCENTS: Record<
  string,
  { bg: string; border: string; text: string; glow: string; badge: string }
> = {
  naivera: {
    bg: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "rgba(16,185,129,0.15)",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  kcb: {
    bg: "from-amber/20 to-yellow-600/10",
    border: "border-amber/30",
    text: "text-amber",
    glow: "rgba(255,168,41,0.15)",
    badge: "bg-amber/10 text-amber border-amber/20",
  },
  subaru: {
    bg: "from-blue-600/20 to-indigo-600/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "rgba(59,130,246,0.15)",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "nation-media": {
    bg: "from-rose-600/20 to-red-600/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    glow: "rgba(244,63,94,0.15)",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

const DEFAULT_ACCENT = {
  bg: "from-amber/20 to-gold/10",
  border: "border-amber/30",
  text: "text-amber",
  glow: "rgba(255,168,41,0.15)",
  badge: "bg-amber/10 text-amber border-amber/20",
};

export default function PartnershipsSection({
  content = DEFAULT_PARTNERSHIPS_CONTENT,
}: PartnershipsSectionProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

  return (
    <div className="mt-28 sm:mt-36 pt-16 border-t border-cream/10">
      {/* ── Section Header ─────────────────────────────────── */}
      <Reveal y={30}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={12} className="shrink-0" />
            <span>{content.title}</span>
          </div>
          <h2 className="font-accent text-amber text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide mb-4">
            {content.subtitle}
          </h2>
          <p
            className={`font-body text-base sm:text-lg leading-relaxed ${
              dark ? "text-cream/65" : "text-navy/75"
            }`}
          >
            {content.description}
          </p>
        </div>
      </Reveal>

      {/* ── External Partnerships Sub-section ──────────────── */}
      <Reveal y={20}>
        <div className="flex items-center gap-4 mb-8">
          <h3
            className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${
              dark ? "text-amber" : "text-gold"
            }`}
          >
            External Industry Partnerships
          </h3>
          <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
        </div>
      </Reveal>

      <StaggerContainer
        className="grid sm:grid-cols-2 gap-6 mb-20"
        stagger={0.1}
      >
        {content.externalPartners.map((partner) => {
          const accent = PARTNER_ACCENTS[partner.id] || DEFAULT_ACCENT;
          return (
            <StaggerItem key={partner.id}>
              <motion.div
                className={`group relative h-full rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  dark
                    ? "bg-navy/60 backdrop-blur-sm border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)]"
                    : "bg-white/80 backdrop-blur-sm border-navy/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(10,38,57,0.08)]"
                }`}
                whileHover={prefersReduced ? {} : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  {/* Top Bar: Brand Monogram & Industry Tag */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.bg} border ${accent.border} flex items-center justify-center font-display font-black text-lg ${accent.text} shadow-sm group-hover:scale-105 transition-transform duration-300`}
                    >
                      {partner.name.substring(0, 2).toUpperCase()}
                    </div>
                    {partner.industry && (
                      <span
                        className={`font-body text-[11px] font-semibold px-3 py-1 rounded-full border ${accent.badge}`}
                      >
                        {partner.industry}
                      </span>
                    )}
                  </div>

                  {/* Partner Name */}
                  <h4
                    className={`font-display text-xl sm:text-2xl font-bold mb-3 group-hover:text-amber transition-colors ${
                      dark ? "text-cream" : "text-navy"
                    }`}
                  >
                    {partner.name}
                  </h4>

                  {/* Partner Value Description */}
                  <p
                    className={`font-body text-sm sm:text-base leading-relaxed ${
                      dark ? "text-cream/70" : "text-navy/75"
                    }`}
                  >
                    {partner.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cream/5 flex items-center gap-2 text-xs font-body text-cream/40">
                  <CheckCircle2 size={13} className="text-amber shrink-0" />
                  <span>Verified SMC Industry Partner</span>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Internal Partnerships Sub-section ──────────────── */}
      <Reveal y={20}>
        <div className="flex items-center gap-4 mb-8">
          <h3
            className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${
              dark ? "text-amber" : "text-gold"
            }`}
          >
            Internal University Partnerships
          </h3>
          <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
        </div>
      </Reveal>

      <StaggerContainer
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        stagger={0.08}
      >
        {content.internalPartners.map((partner, index) => (
          <StaggerItem key={partner.id || index}>
            <motion.div
              className={`group relative h-full rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex items-center gap-4 ${
                dark
                  ? "bg-navy/40 backdrop-blur-sm border-cream/10 hover:border-amber/40 hover:bg-navy/60"
                  : "bg-white border-navy/10 hover:border-amber/40 hover:shadow-md"
              }`}
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber shrink-0 group-hover:bg-amber/20 group-hover:scale-105 transition-all">
                {index % 4 === 0 ? (
                  <Award size={18} />
                ) : index % 4 === 1 ? (
                  <Globe size={18} />
                ) : index % 4 === 2 ? (
                  <Users size={18} />
                ) : (
                  <Target size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-display text-sm sm:text-base font-bold truncate group-hover:text-amber transition-colors ${
                    dark ? "text-cream" : "text-navy"
                  }`}
                >
                  {partner.name}
                </h4>
                {partner.category && (
                  <p
                    className={`font-body text-xs truncate mt-0.5 ${
                      dark ? "text-cream/50" : "text-navy/60"
                    }`}
                  >
                    {partner.category}
                  </p>
                )}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
