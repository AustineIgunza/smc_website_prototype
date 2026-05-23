"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * SMC Logo component — uses the official PNG lockup from /public/logo/.
 *
 * - `variant="full"`: full lockup (M monogram + STRATHMORE + MARKETING CLUB)
 * - `variant="mark"`: monogram only (cropped via CSS)
 * - `theme="dark"`: original colors — cream "STRATHMORE", amber "MARKETING CLUB" (for dark backgrounds)
 * - `theme="light"`: inverted wordmark so "STRATHMORE" reads as navy (for cream/light backgrounds)
 * - `asLink`: wraps in a Next.js Link to "/"
 */

interface LogoProps {
  variant?: "full" | "mark";
  theme?: "dark" | "light";
  size?: number;
  className?: string;
  asLink?: boolean;
}

export default function Logo({
  variant = "full",
  theme = "dark",
  size = 48,
  className = "",
  asLink = false,
}: LogoProps) {
  // Actual PNG is 1200x652 → aspect ratio ~1.84
  const isMark = variant === "mark";
  const IMG_W = 1200;
  const IMG_H = 652;
  const fullAspect = IMG_W / IMG_H;
  const width = isMark ? size : Math.round(size * fullAspect);
  const height = size;

  const content = (
    <span
      role="img"
      aria-label="Strathmore Marketing Club"
      className={`inline-flex items-center justify-center overflow-visible ${className}`}
      style={isMark ? { width: size, height: size } : { width, height }}
    >
      <Image
        src="/logo/smc-logo-full.png"
        alt=""
        aria-hidden
        priority
        width={IMG_W}
        height={IMG_H}
        className={`
          ${isMark
            ? "h-auto [clip-path:inset(0_22%_45%_22%)]"
            : "w-full h-full object-contain"
          }
          ${theme === "light" ? "[filter:brightness(0)_saturate(100%)_invert(12%)_sepia(60%)_saturate(2000%)_hue-rotate(175deg)_brightness(95%)]" : ""}
        `}
        style={isMark ? { width: size * 2.2 } : undefined}
      />
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
