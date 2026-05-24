"use client";

import Reveal from "../ui/Reveal";
import SectionEyebrow from "../ui/SectionEyebrow";
import { StaggerContainer, StaggerItem } from "../ui/Reveal";
import { useTheme } from "../ThemeProvider";

export default function InsideAgency() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <SectionEyebrow label="Inside the Agency" className="mb-4" />
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            A Look at <span className="text-amber">What We Do</span>
          </h2>
          <p
            className={`font-body text-base sm:text-lg max-w-2xl mx-auto ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            From brand strategy sessions to live campaign shoots — here's
            a glimpse inside the SMC experience.
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
                Workshop Session
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
                Marketing Week Panel
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
                Pitch Day
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
                Team Bonding
              </span>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
