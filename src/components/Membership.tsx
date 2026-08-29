"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import { benefits, type Benefit } from "@/data/membership";
import {
  Check,
  ArrowRight,
  Target,
  Brain,
  Handshake,
  Trophy,
  TrendingUp,
  Palette,
} from "./icons";

function BenefitIcon({
  id,
  size = 28,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  switch (id) {
    case "live-campaigns":
      return <Target size={size} className={className} />;
    case "workshops":
      return <Brain size={size} className={className} />;
    case "networking":
      return <Handshake size={size} className={className} />;
    case "competitions":
      return <Trophy size={size} className={className} />;
    case "career-access":
      return <TrendingUp size={size} className={className} />;
    case "creative-freedom":
      return <Palette size={size} className={className} />;
    default:
      return <Target size={size} className={className} />;
  }
}

/* ── Benefit detail content ──────────────────────────── */
function BenefitDetail({ benefit }: { benefit: Benefit }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="pr-4">
      <div className="mx-auto sm:mx-0 w-fit mb-5">
        <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center text-amber shadow-md">
          <BenefitIcon id={benefit.id} size={32} />
        </div>
      </div>
      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {benefit.title}
      </h3>
      <p
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {benefit.longDesc}
      </p>

      <p
        className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
          dark ? "text-cream/40" : "text-navy/50"
        }`}
      >
        What You Get
      </p>
      <ul className="space-y-2">
        {benefit.highlights.map((h, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-1 w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0 text-amber">
              <Check size={12} strokeWidth={3} />
            </span>
            <span
              className={`font-body text-sm leading-relaxed ${
                dark ? "text-cream/65" : "text-navy/75"
              }`}
            >
              {h}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Membership() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState<Benefit | null>(null);

  return (
    <section
      id="membership"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal y={40}>
          <h1 className="font-accent text-amber text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-4 tracking-wide">
            Membership
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Why Join <span className="text-amber">SMC</span>?
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-20 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Membership isn&apos;t just a card &mdash; it&apos;s access to a
            launchpad that accelerates your marketing career from day one.
          </p>
        </Reveal>

        <Reveal y={40}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${dark ? "text-amber" : "text-gold"}`}>
              Member Benefits
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>
        </Reveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          stagger={0.1}
        >
          {benefits.map((b) => (
            <StaggerItem key={b.id}>
              <ClickableCard onClick={() => setSelected(b)} cue="Learn more">
                <div className="p-6 sm:p-8 text-center flex flex-col justify-between h-full">
                  <div>
                    {/* Centered Benefit Icon container */}
                    <div className="mx-auto mb-5 w-fit relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-cream/5 border border-white/20 dark:border-white/10 shadow-md flex items-center justify-center text-amber select-none group-hover:bg-amber/10 group-hover:border-amber/30 transition-all duration-300"
                        whileHover={
                          prefersReduced ? {} : { scale: 1.1, rotate: 5, transition: { duration: 0.2 } }
                        }
                      >
                        <BenefitIcon id={b.id} size={28} className="text-amber group-hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                    </div>

                    <h3
                      className={`font-display text-base sm:text-lg font-bold mb-2 group-hover:text-amber transition-colors ${
                        dark ? "text-cream" : "text-navy"
                      }`}
                    >
                      {b.title}
                    </h3>
                    <p
                      className={`font-body text-sm leading-relaxed ${
                        dark ? "text-cream/60" : "text-navy/75"
                      }`}
                    >
                      {b.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-cream/5 mt-4 text-xs font-body text-amber/90 font-semibold group-hover:text-amber transition-colors inline-flex items-center gap-1.5">
                    <span>Learn more</span>
                    <ArrowRight size={13} className="shrink-0" />
                  </div>
                </div>
              </ClickableCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        {selected && <BenefitDetail benefit={selected} />}
      </DetailModal>
    </section>
  );
}
