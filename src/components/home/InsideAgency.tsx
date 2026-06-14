"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import { StaggerContainer, StaggerItem } from "../ui/Reveal";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

export default function InsideAgency({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <SectionEyebrow label={content.insideEyebrow} className="mb-4" />
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            {content.insideTitleStart} <span className="text-amber">{content.insideTitleAccent}</span>
          </h2>
          <p
            className={`font-body text-base sm:text-lg max-w-2xl mx-auto ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            {content.insideSubtitle}
          </p>
        </Reveal>

        {/* Bento image grid */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px]"
          stagger={0.1}
        >
          {/* Tall left — spans 2 rows */}
          <StaggerItem className="col-span-1 md:col-span-2 row-span-2">
            <div
              className={`w-full h-full rounded-2xl overflow-hidden flex items-end p-4 sm:p-6 ${
                dark ? "bg-cream/5" : "bg-navy/5"
              }`}
            >
              {/* TODO: Replace with <Image /> — tall event/workshop photo */}
              <span
                className={`font-body text-xs font-medium tracking-wide uppercase ${
                  dark ? "text-cream/40" : "text-navy/30"
                }`}
              >
                {content.insideTile1Label}
              </span>
            </div>
          </StaggerItem>

          {/* Wide top-right — spans 2 cols */}
          <StaggerItem className="col-span-2 row-span-1">
            <div
              className={`w-full h-full rounded-2xl overflow-hidden flex items-end p-4 sm:p-6 ${
                dark ? "bg-cream/5" : "bg-navy/5"
              }`}
            >
              <span
                className={`font-body text-xs font-medium tracking-wide uppercase ${
                  dark ? "text-cream/40" : "text-navy/30"
                }`}
              >
                {content.insideTile2Label}
              </span>
            </div>
          </StaggerItem>

          {/* Two small bottom-right */}
          <StaggerItem className="col-span-1 row-span-1">
            <div
              className={`w-full h-full rounded-2xl overflow-hidden flex items-end p-3 sm:p-4 ${
                dark ? "bg-cream/5" : "bg-navy/5"
              }`}
            >
              <span
                className={`font-body text-xs font-medium tracking-wide uppercase ${
                  dark ? "text-cream/40" : "text-navy/30"
                }`}
              >
                {content.insideTile3Label}
              </span>
            </div>
          </StaggerItem>

          <StaggerItem className="col-span-1 row-span-1">
            <div
              className={`w-full h-full rounded-2xl overflow-hidden flex items-end p-3 sm:p-4 ${
                dark ? "bg-cream/5" : "bg-navy/5"
              }`}
            >
              <span
                className={`font-body text-xs font-medium tracking-wide uppercase ${
                  dark ? "text-cream/40" : "text-navy/30"
                }`}
              >
                {content.insideTile4Label}
              </span>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
