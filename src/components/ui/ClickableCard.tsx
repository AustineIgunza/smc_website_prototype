"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../ThemeProvider";

interface ClickableCardProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  cue?: string;
}

export default function ClickableCard({
  children,
  onClick,
  className = "",
  cue = "View details",
}: ClickableCardProps) {
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border transition-colors cursor-pointer overflow-hidden ${
        dark
          ? "border-cream/10 hover:border-amber/40"
          : "border-navy/10 hover:border-amber/40"
      } ${className}`}
      whileHover={prefersReduced ? {} : { y: -4, transition: { duration: 0.25 } }}
      whileTap={prefersReduced ? {} : { scale: 0.985 }}
    >
      {/* Amber glow on hover */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_20px_rgba(255,168,41,0.08)]" />

      {children}

      {/* "View details →" cue */}
      <span
        className={`absolute bottom-3 right-4 font-body text-xs font-medium tracking-wide text-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          prefersReduced ? "opacity-100" : ""
        }`}
      >
        {cue} &rarr;
      </span>
    </motion.button>
  );
}
