"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../ThemeProvider";

interface CountdownProps {
  targetDate: string;
  label: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate, label }: CountdownProps) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(targetDate));
  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { val: time.days, label: "Days" },
    { val: time.hours, label: "Hours" },
    { val: time.mins, label: "Mins" },
    { val: time.secs, label: "Secs" },
  ];

  return (
    <div className={`rounded-2xl p-5 sm:p-6 border ${
      dark ? "bg-navy/40 border-cream/10" : "bg-white border-navy/10 shadow-sm"
    }`}>
      <p className={`font-body text-xs font-semibold tracking-[0.2em] uppercase mb-1 ${
        dark ? "text-cream/40" : "text-navy/40"
      }`}>
        Next Event
      </p>
      <p className={`font-display text-base sm:text-lg font-bold mb-4 ${
        dark ? "text-cream" : "text-navy"
      }`}>
        {label}
      </p>
      <div className="flex gap-3 sm:gap-4">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-amber tabular-nums">
              {pad(u.val)}
            </span>
            <p className={`font-body text-[10px] sm:text-xs mt-1 ${
              dark ? "text-cream/40" : "text-navy/40"
            }`}>
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
