"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

export default function MissionVision({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Mission */}
          <Reveal>
            <SectionEyebrow label={content.missionEyebrow} variant="dash" className="mb-4" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              {content.missionTitle}
              <br />
              <span className="text-amber">{content.missionTitleAccent}</span>
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              {content.missionBody}
            </p>
          </Reveal>

          {/* Vision */}
          <Reveal delay={0.15}>
            <SectionEyebrow label={content.visionEyebrow} variant="dash" className="mb-4" />
            <h2
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${
                dark ? "text-cream" : "text-navy"
              }`}
            >
              {content.visionTitle}
              <br />
              <span className="text-amber">{content.visionTitleAccent}</span>
            </h2>
            <p
              className={`font-body text-base sm:text-lg leading-relaxed ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              {content.visionBody}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
