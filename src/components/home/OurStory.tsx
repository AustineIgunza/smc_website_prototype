"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import StatCard from "../ui/StatCard";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

export default function OurStory({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-navy" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — narrative */}
          <Reveal>
            <SectionEyebrow label={content.storyEyebrow} className="mb-6" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              {content.storyHeading}
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed mb-5 ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              {content.storyParagraph1}
            </p>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              {content.storyParagraph2}
            </p>
          </Reveal>

          {/* Right — stats */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value={content.stat1Value}
                label={content.stat1Label}
                className="col-span-1"
              />
              <StatCard
                value={content.stat2Value}
                label={content.stat2Label}
                className="col-span-1"
              />
              <StatCard
                value={content.stat3Value}
                label={content.stat3Label}
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
