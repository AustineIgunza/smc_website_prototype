"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";
import {
  DEFAULT_MEMBERSHIP_CONTENT,
  type MembershipContent,
} from "@/data/membership-defaults";
import {
  Target,
  Brain,
  Handshake,
  Trophy,
  TrendingUp,
  Palette,
  Briefcase,
  Globe,
  Heart,
  Award,
  Sparkles,
  Users,
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
  const key = (icon || id || "").toLowerCase();
  switch (key) {
    case "industry-exposure":
    case "live-campaigns":
    case "target":
      return <Target size={size} className={className} />;
    case "workshops":
    case "brain":
      return <Brain size={size} className={className} />;
    case "networking":
    case "handshake":
      return <Handshake size={size} className={className} />;
    case "leadership-execution":
    case "competitions":
    case "trophy":
      return <Trophy size={size} className={className} />;
    case "career-access":
    case "chart":
      return <TrendingUp size={size} className={className} />;
    case "portfolio-building":
    case "creative-freedom":
    case "palette":
      return <Palette size={size} className={className} />;
    case "community-growth":
    case "heart":
      return <Heart size={size} className={className} />;
    case "briefcase":
      return <Briefcase size={size} className={className} />;
    case "users":
      return <Users size={size} className={className} />;
    case "award":
      return <Award size={size} className={className} />;
    case "sparkles":
      return <Sparkles size={size} className={className} />;
    default:
      return <Target size={size} className={className} />;
  }
}

/* ── Main component ──────────────────────────────────── */
export default function Membership({ content = DEFAULT_MEMBERSHIP_CONTENT }: { content?: MembershipContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();

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
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          stagger={0.1}
        >
          {content.benefits.map((b) => (
            <StaggerItem key={b.id}>
              <motion.div
                className={`group relative h-full rounded-2xl border p-6 sm:p-8 transition-all duration-300 flex flex-col justify-start ${
                  dark
                    ? "bg-navy/60 backdrop-blur-sm border-cream/10 hover:border-amber/40 hover:bg-navy/80 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)]"
                    : "bg-white/80 backdrop-blur-sm border-navy/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(10,38,57,0.08)]"
                }`}
                whileHover={prefersReduced ? {} : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Icon Container */}
                <div className="mb-6 w-fit">
                  <div className="w-14 h-14 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber shadow-sm group-hover:bg-amber/20 group-hover:border-amber/40 group-hover:scale-105 transition-all duration-300">
                    <BenefitIcon icon={b.icon} id={b.id} size={26} className="text-amber" />
                  </div>
                </div>

                {/* Header / Title */}
                <h3
                  className={`font-display text-lg sm:text-xl font-bold mb-3 group-hover:text-amber transition-colors ${
                    dark ? "text-cream" : "text-navy"
                  }`}
                >
                  {b.title}
                </h3>

                {/* Description */}
                <p
                  className={`font-body text-sm sm:text-base leading-relaxed ${
                    dark ? "text-cream/70" : "text-navy/75"
                  }`}
                >
                  {b.desc}
                </p>
              </motion.div>
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
    </section>
  );
}
