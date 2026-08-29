"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import {
  DEFAULT_MEMBERSHIP_CONTENT,
  type MembershipContent,
  type Benefit,
} from "@/data/membership-defaults";
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
  icon,
  id,
  size = 28,
  className = "",
}: {
  icon?: string;
  id?: string;
  size?: number;
  className?: string;
}) {
  const key = icon || id;
  switch (key) {
    case "live-campaigns":
    case "target":
      return <Target size={size} className={className} />;
    case "workshops":
    case "brain":
      return <Brain size={size} className={className} />;
    case "networking":
    case "handshake":
      return <Handshake size={size} className={className} />;
    case "competitions":
    case "trophy":
      return <Trophy size={size} className={className} />;
    case "career-access":
    case "chart":
      return <TrendingUp size={size} className={className} />;
    case "creative-freedom":
    case "palette":
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
          <BenefitIcon icon={benefit.icon} id={benefit.id} size={32} />
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
export default function Membership({ content = DEFAULT_MEMBERSHIP_CONTENT }: { content?: MembershipContent }) {
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
            {content.title}
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            {content.subtitle.split("SMC").map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && content.subtitle.includes("SMC") && <span className="text-amber">SMC</span>}
              </span>
            ))}
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-20 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            {content.description}
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
          {content.benefits.map((b) => (
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
                        <BenefitIcon icon={b.icon} id={b.id} size={28} className="text-amber group-hover:scale-110 transition-transform duration-300" />
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

        {/* ── How to Join Section ──────────────────────────── */}
        <Reveal y={40} className="mt-24 sm:mt-32">
          <div className="flex items-center gap-4 mb-8">
            <h3 className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${dark ? "text-amber" : "text-gold"}`}>
              {content.joinTitle}
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>
        </Reveal>

        <Reveal y={40}>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className={`font-body text-base sm:text-lg mb-8 ${dark ? "text-cream/60" : "text-navy/75"}`}>
              {content.joinDescription}
            </p>
            <motion.a
              href={content.joinCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber text-teal font-body font-bold text-base hover:brightness-110 shadow-lg shadow-amber/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{content.joinCtaLabel}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.a>
          </div>
        </Reveal>

        {/* Dynamic grid mapping depending on step counts for elegant alignment */}
        <StaggerContainer
          className={`grid gap-6 sm:gap-8 mt-12 ${
            content.joinSteps.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
            content.joinSteps.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" :
            content.joinSteps.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" :
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
          stagger={0.15}
        >
          {content.joinSteps.map((step, idx) => (
            <StaggerItem key={idx}>
              <div
                className={`relative flex flex-col h-full rounded-2xl border p-6 transition-all duration-300 ${
                  dark
                    ? "bg-navy/40 border-cream/15 hover:border-amber/40 hover:bg-navy/60"
                    : "bg-white border-navy/10 hover:border-amber/40 hover:shadow-lg hover:shadow-navy/5"
                }`}
              >
                <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-amber text-teal font-display text-xs font-black tracking-widest shadow-md">
                  STEP {step.num}
                </div>
                
                <div className="pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={`font-display text-base font-bold mb-2 ${dark ? "text-cream" : "text-navy"}`}>
                      {step.title}
                    </h4>
                    <p className={`font-body text-sm leading-relaxed mb-6 ${dark ? "text-cream/60" : "text-navy/70"}`}>
                      {step.desc}
                    </p>
                  </div>
                  
                  {/* Screenshot Mockup Container */}
                  <div className={`mt-auto aspect-video rounded-xl overflow-hidden border flex items-center justify-center relative group ${
                    dark ? "bg-navy/80 border-cream/10" : "bg-cream/30 border-navy/10"
                  }`}>
                    {/* Placeholder image that will show if it exists, otherwise fall back to styled div */}
                    <img
                      src={step.screenshotUrl || `/images/membership/step-${step.num}.png`}
                      alt={`Step ${step.num} Screenshot`}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // If file is not found, hide the img element to show fallback pattern
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    
                    {/* Fallback Display if Image is Missing */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none select-none">
                      <svg
                        className={`w-8 h-8 mb-2 ${dark ? "text-cream/20" : "text-navy/20"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                      </svg>
                      <span className={`font-body text-xs ${dark ? "text-cream/30" : "text-navy/35"}`}>
                        Screenshot Placeholder
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
