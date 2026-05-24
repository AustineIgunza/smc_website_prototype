"use client";

import { useTheme } from "../ThemeProvider";

interface SectionEyebrowProps {
  label: string;
  variant?: "pill" | "dash";
  /* TODO: prototypes use a lilac/periwinkle accent for some pills — using neutral tint for now.
     Set accent="neutral" for those; swap to a brand-lilac tint later if desired. */
  accent?: "amber" | "neutral";
  className?: string;
}

export default function SectionEyebrow({
  label,
  variant = "pill",
  accent = "amber",
  className = "",
}: SectionEyebrowProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  if (variant === "dash") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="w-8 h-0.5 bg-amber" />
        <span
          className={`font-body text-xs font-semibold tracking-[0.2em] uppercase ${
            accent === "amber"
              ? "text-amber"
              : dark
                ? "text-cream/50"
                : "text-navy/50" /* neutral tint — lilac substitute */
          }`}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-block font-body text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full ${
        accent === "amber"
          ? "bg-amber/10 text-amber"
          : dark
            ? "bg-cream/5 text-cream/50"
            : "bg-navy/5 text-navy/50" /* neutral tint — lilac substitute */
      } ${className}`}
    >
      {label}
    </span>
  );
}
