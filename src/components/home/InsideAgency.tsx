"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import { StaggerContainer, StaggerItem } from "../ui/Reveal";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

export default function InsideAgency({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const eyebrow = content.insideEyebrow || DEFAULT_HOME_CONTENT.insideEyebrow;
  const titleStart = content.insideTitleStart || DEFAULT_HOME_CONTENT.insideTitleStart;
  const titleAccent = content.insideTitleAccent || DEFAULT_HOME_CONTENT.insideTitleAccent;
  const subtitle = content.insideSubtitle;

  const tile1 = content.insideTile1Image || DEFAULT_HOME_CONTENT.insideTile1Image;
  const tile2 = content.insideTile2Image || DEFAULT_HOME_CONTENT.insideTile2Image;
  const tile3 = content.insideTile3Image || DEFAULT_HOME_CONTENT.insideTile3Image;

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          {eyebrow && <SectionEyebrow label={eyebrow} className="mb-4" />}
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold ${
              subtitle ? "mb-4" : ""
            } ${dark ? "text-cream" : "text-navy"}`}
          >
            {titleStart} <span className="text-amber">{titleAccent}</span>
          </h2>
          {subtitle && (
            <p
              className={`font-body text-base sm:text-lg max-w-2xl mx-auto ${
                dark ? "text-cream/60" : "text-navy/75"
              }`}
            >
              {subtitle}
            </p>
          )}
        </Reveal>

        {/* Bento image grid — 3 tiles */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 auto-rows-[200px] sm:auto-rows-[230px] md:auto-rows-[250px]"
          stagger={0.1}
        >
          {/* Tile 1: Featured Large Left — spans 2 cols & 2 rows on desktop */}
          <StaggerItem className="col-span-1 md:col-span-2 row-span-2">
            <div
              className={`group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 ${
                dark
                  ? "bg-navy/60 border-cream/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)]"
                  : "bg-white/80 border-navy/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(10,38,57,0.08)]"
              }`}
            >
              {tile1 && (
                <img
                  src={tile1}
                  alt="SMC member activity"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </StaggerItem>

          {/* Tile 2: Top Right */}
          <StaggerItem className="col-span-1 md:col-span-1 row-span-1">
            <div
              className={`group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 ${
                dark
                  ? "bg-navy/60 border-cream/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)]"
                  : "bg-white/80 border-navy/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(10,38,57,0.08)]"
              }`}
            >
              {tile2 && (
                <img
                  src={tile2}
                  alt="SMC member activity"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </StaggerItem>

          {/* Tile 3: Bottom Right */}
          <StaggerItem className="col-span-1 md:col-span-1 row-span-1">
            <div
              className={`group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 ${
                dark
                  ? "bg-navy/60 border-cream/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)]"
                  : "bg-white/80 border-navy/10 hover:border-amber/40 hover:shadow-[0_16px_32px_rgba(10,38,57,0.08)]"
              }`}
            >
              {tile3 && (
                <img
                  src={tile3}
                  alt="SMC member activity"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
