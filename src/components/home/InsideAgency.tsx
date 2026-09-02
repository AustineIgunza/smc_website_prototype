"use client";

import Link from "next/link";
import { StaggerContainer, StaggerItem } from "../ui/Reveal";
import { useTheme } from "../ThemeProvider";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

// Map each Inside-the-Agency tile to the past event it depicts so clicking
// deep-links to that event's modal on /events/past.
const TILE_SLUGS: Record<1 | 2 | 3 | 4, string> = {
  1: "the-13th",
  2: "the-13th",
  3: "subaru-visit",
  4: "mathare-visit-with-sesc",
};

type TileProps = {
  label: string;
  image: string | null;
  href: string;
  dark: boolean;
  compact?: boolean;
};

function Tile({ label, image, href, dark, compact = false }: TileProps) {
  const pad = compact ? "p-3 sm:p-4" : "p-4 sm:p-6";
  const bg = dark ? "bg-cream/5" : "bg-navy/5";
  const labelColor = image
    ? "text-cream"
    : dark
      ? "text-cream/40"
      : "text-navy/30";

  return (
    <Link
      href={href}
      aria-label={`View ${label} on past events`}
      className={`group relative block w-full h-full rounded-2xl overflow-hidden ${bg} focus:outline-none focus:ring-2 focus:ring-amber/70 focus:ring-offset-2 focus:ring-offset-transparent`}
    >
      {image && (
        <>
          <img
            src={image}
            alt={label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </>
      )}
      <span
        className={`absolute inset-0 flex items-end ${pad} font-body text-xs font-medium tracking-wide uppercase ${labelColor}`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function InsideAgency({ content = DEFAULT_HOME_CONTENT }: { content?: HomeContent }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const hrefFor = (n: 1 | 2 | 3 | 4) => `/events/past?event=${TILE_SLUGS[n]}`;

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Bento image grid */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px]"
          stagger={0.1}
        >
          {/* Tall left — spans 2 rows */}
          <StaggerItem className="col-span-1 md:col-span-2 row-span-2">
            <Tile
              label={content.insideTile1Label}
              image={content.insideTile1Image}
              href={hrefFor(1)}
              dark={dark}
            />
          </StaggerItem>

          {/* Wide top-right — spans 2 cols */}
          <StaggerItem className="col-span-2 row-span-1">
            <Tile
              label={content.insideTile2Label}
              image={content.insideTile2Image}
              href={hrefFor(2)}
              dark={dark}
            />
          </StaggerItem>

          {/* Two small bottom-right */}
          <StaggerItem className="col-span-1 row-span-1">
            <Tile
              label={content.insideTile3Label}
              image={content.insideTile3Image}
              href={hrefFor(3)}
              dark={dark}
              compact
            />
          </StaggerItem>

          <StaggerItem className="col-span-1 row-span-1">
            <Tile
              label={content.insideTile4Label}
              image={content.insideTile4Image}
              href={hrefFor(4)}
              dark={dark}
              compact
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
