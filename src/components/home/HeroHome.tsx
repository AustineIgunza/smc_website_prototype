"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import SectionEyebrow from "../ui/SectionEyebrow";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";
import {
  InstagramIcon,
  LinkedInIcon,
  XTwitterIcon,
  TikTokIcon,
  ArrowUpRight,
} from "@/components/icons";

const easing = [0.16, 1, 0.3, 1] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: <InstagramIcon size={18} />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <LinkedInIcon size={18} />,
  },
  {
    label: "Twitter",
    href: "#",
    icon: <XTwitterIcon size={18} />,
  },
  {
    label: "TikTok",
    href: "#",
    icon: <TikTokIcon size={18} />,
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
      {/* Background: THE 13TH auditorium shot — the biggest event of the year. */}
      <div className="absolute inset-0 bg-navy">
        <img
          src="/events/the13th-audience-1.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
