"use client";

import CountUp from "./CountUp";
import { useTheme } from "../ThemeProvider";

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  variant?: "white" | "amber";
  className?: string;
}

export default function StatCard({
  value,
  suffix = "+",
  label,
  variant = "white",
  className = "",
}: StatCardProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  if (variant === "amber") {
    return (
      <div className={`rounded-2xl bg-amber p-6 sm:p-8 ${className}`}>
        <p className="font-body text-sm text-teal/70 mb-1">{label}</p>
        <CountUp
          target={value}
          suffix={suffix}
          className="font-display text-4xl sm:text-5xl font-bold text-teal"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 ${
        dark
          ? "bg-cream/5 border border-cream/10"
          : "bg-white shadow-sm border border-navy/5"
      } ${className}`}
    >
      <CountUp
        target={value}
        suffix={suffix}
        className={`font-display text-4xl sm:text-5xl font-bold text-amber`}
      />
      <p
        className={`font-body text-sm mt-2 ${
          dark ? "text-cream/60" : "text-navy/60"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
