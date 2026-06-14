"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import SectionEyebrow from "../ui/SectionEyebrow";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

const easing = [0.16, 1, 0.3, 1] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07 6.26 6.26 0 0 0 0 12.52 6.27 6.27 0 0 0 6.28-6.25V8.91a8.22 8.22 0 0 0 3.82.96V6.69z" />
      </svg>
    ),
  },
];

export default function HeroHome({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Background image placeholder — replace src with a real event/auditorium photo */}
      <div className="absolute inset-0 bg-navy">
        {/* TODO: Add a real hero image here:
            <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20"
        style={prefersReduced ? {} : { y: textY, opacity }}
      >
        <div className="max-w-2xl">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          >
            <SectionEyebrow label={content.heroEyebrow} accent="amber" className="mb-6" />
          </motion.div>

          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-cream mb-6 sm:mb-8"
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: easing }}
          >
            {content.heroTitleLine1}
            <br />
            {content.heroTitleLine2}
            <br />
            <span className="text-amber">{content.heroTitleAccent}</span>
          </motion.h1>

          <motion.p
            className="font-body text-base sm:text-lg md:text-xl text-cream/70 max-w-lg mb-8 sm:mb-10 leading-relaxed"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: easing }}
          >
            {content.heroSubtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-10 sm:mb-12"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: easing }}
          >
            <Link
              href={content.heroPrimaryCtaHref}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-amber text-teal font-body font-semibold text-sm tracking-wide hover:bg-gold transition-colors"
            >
              {content.heroPrimaryCtaLabel}
            </Link>
            <Link
              href={content.heroSecondaryCtaHref}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 border-cream/30 text-cream font-body font-semibold text-sm tracking-wide hover:bg-cream/10 backdrop-blur-sm transition-colors"
            >
              {content.heroSecondaryCtaLabel}
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: easing }}
          >
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-amber hover:border-amber/40 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 sm:h-40 z-10 bg-gradient-to-t to-transparent ${
        dark ? "from-teal" : "from-cream"
      }`} />
    </section>
  );
}
