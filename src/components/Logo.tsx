"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

interface LogoProps {
  variant?: "full" | "mark";
  size?: number;
  className?: string;
  asLink?: boolean;
}

const logos = {
  light: { src: "/logo/smc-cyprus-vertical-2.png", w: 3000, h: 1425 },
  dark: { src: "/logo/smc-logo-full.png", w: 1200, h: 652 },
};

export default function Logo({
  variant = "full",
  size = 48,
  className = "",
  asLink = false,
}: LogoProps) {
  const { theme } = useTheme();
  const isMark = variant === "mark";
  const { src, w, h } = logos[theme];
  const aspect = w / h;
  const width = isMark ? size : Math.round(size * aspect);
  const height = size;

  const content = (
    <span
      role="img"
      aria-label="Strathmore Marketing Club"
      className={`inline-flex items-center justify-center overflow-visible ${className}`}
      style={isMark ? { width: size, height: size } : { width, height }}
    >
      <Image
        src={src}
        alt=""
        aria-hidden
        priority
        width={w}
        height={h}
        className={
          isMark
            ? "h-auto [clip-path:inset(0_22%_45%_22%)]"
            : "w-full h-full object-contain"
        }
        style={isMark ? { width: size * 2.2 } : undefined}
      />
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        {content}
      </Link>
    );
  }

  return content;
}
