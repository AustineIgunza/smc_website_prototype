"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Button from "./ui/Button";

const easing = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-teal"
    >
      {/* Background watermark — actual logo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={prefersReduced ? {} : { y: bgY }}
      >
        <img
          src="/logo/smc-logo-full.png"
          alt=""
          aria-hidden="true"
          className="w-[500px] md:w-[700px] lg:w-[900px] opacity-[0.06]"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        style={prefersReduced ? {} : { y: textY, opacity, scale }}
      >
        <motion.p
          className="font-accent text-amber text-lg md:text-xl mb-6 tracking-wide"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
        >
          Strathmore Marketing Club
        </motion.p>

        <motion.h1
          className="font-display font-bold text-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8"
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
          className="font-body text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easing }}
        >
          We build agency-level thinkers, creators, and strategists. Join a community
          that turns bold ideas into real-world campaigns.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: easing }}
        >
          <Button variant="primary" href="#join">
            Join the Club
          </Button>
          <Button variant="outline" href="#portfolio">
            See Our Work
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
