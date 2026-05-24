"use client";

import Logo from "./Logo";
import Reveal from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

export default function About() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section id="about" className={`relative overflow-hidden py-12 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="dots" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <Reveal>
            <div className="flex items-center justify-center">
              <Logo variant="full" size={120} />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4">
              Who We Are
            </p>
            <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}>
              Where Bold Ideas
              <br />
              Meet <span className="text-amber">Real Campaigns</span>
            </h2>
            <p className={`font-body text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 ${
              dark ? "text-cream/70" : "text-navy/80"
            }`}>
              The Strathmore Marketing Club is the premier student-run marketing
              organization at Strathmore University. We bridge the gap between
              classroom theory and industry practice — giving members hands-on
              experience in branding, digital strategy, content creation, and
              campaign execution.
            </p>
            <p className={`font-body text-base sm:text-lg leading-relaxed ${
              dark ? "text-cream/70" : "text-navy/80"
            }`}>
              Whether you&apos;re a first-year exploring marketing or a
              final-year sharpening your portfolio, SMC is where you grow from
              student to strategist.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
