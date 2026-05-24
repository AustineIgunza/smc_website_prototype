"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Button from "./ui/Button";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const easing = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  return (
    <section
      ref={ref}
      className={`relative min-h-[100dvh] flex items-center justify-center overflow-hidden ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="waves" surface={dark ? "teal" : "cream"} />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-20 pb-10 text-center"
        style={prefersReduced ? {} : { y: textY, opacity, scale }}
      >
        <motion.p
          className="font-accent text-amber text-base sm:text-lg md:text-xl mb-4 sm:mb-6 tracking-wide"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
        >
          Strathmore Marketing Club
        </motion.p>

        <motion.h1
          className={`font-display font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 sm:mb-8 ${
            dark ? "text-cream" : "text-navy"
          }`}
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: easing }}
        >
          The Premier Launchpad
          <br />
          <span className="text-amber">for Marketing Talent</span>
          <br />
          in Kenya
        </motion.h1>

        <motion.p
          className={`font-body text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed ${
            dark ? "text-cream/70" : "text-navy/70"
          }`}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easing }}
        >
          We build agency-level thinkers, creators, and strategists. Join a community
          that turns bold ideas into real-world campaigns.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: easing }}
        >
          <Button variant="primary" href="/register">
            Join the Club
          </Button>
          <Button variant="outline" href="/portfolio">
            See Our Work
          </Button>
        </motion.div>
      </motion.div>

      <div className={`absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t to-transparent z-10 ${
        dark ? "from-teal" : "from-cream"
      }`} />
    </section>
  );
}
