"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import { useTheme } from "../ThemeProvider";

export default function MissionVision() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Mission */}
          <Reveal>
            <SectionEyebrow label="Our Mission" variant="dash" className="mb-4" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              Building Marketing Leaders
              <br />
              <span className="text-amber">From the Ground Up</span>
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              We equip students with the strategic thinking, creative skills,
              and industry connections needed to thrive in the fast-evolving
              world of marketing. Through hands-on campaigns, workshops, and
              mentorship, we transform ambitious students into agency-ready
              professionals.
            </p>
          </Reveal>

          {/* Vision */}
          <Reveal delay={0.15}>
            <SectionEyebrow label="Our Vision" variant="dash" className="mb-4" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              The Most Impactful
              <br />
              <span className="text-amber">Student Marketing Hub</span>
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              To be the leading student-run marketing organization in Africa
              — a launchpad where bold ideas become real campaigns, and where
              every member graduates with a portfolio, a network, and the
              confidence to lead.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
