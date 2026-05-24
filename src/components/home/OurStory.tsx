"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import StatCard from "../ui/StatCard";
import { useTheme } from "../ThemeProvider";

/* Stats: Kenya focus, confirmed numbers (30+/10+/5+) */

export default function OurStory() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-navy" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — narrative */}
          <Reveal>
            <SectionEyebrow label="Est. 2014" className="mb-6" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              Our Story
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed mb-5 ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              Founded in 2014 at Strathmore University, the Strathmore
              Marketing Club began as a small group of students passionate
              about bridging the gap between classroom theory and real-world
              marketing practice. What started as informal study sessions
              quickly grew into a full-fledged student organization.
            </p>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              Today, SMC is the premier student-run marketing organization
              at Strathmore — giving members hands-on experience in branding,
              digital strategy, content creation, and campaign execution
              through partnerships with real brands and agencies across
              Kenya.
            </p>
          </Reveal>

          {/* Right — stats */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value={30}
                label="Active Members"
                className="col-span-1"
              />
              <StatCard
                value={10}
                label="Events Hosted"
                className="col-span-1"
              />
              <StatCard
                value={5}
                label="Industry Partners — Connecting students with the best"
                variant="amber"
                className="col-span-2"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
