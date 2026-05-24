"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const prefersReduced = useReducedMotion();
  const dark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        dark
          ? "text-cream hover:bg-cream/10"
          : "text-teal hover:bg-teal/10"
      }`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={prefersReduced ? {} : { scale: 0.9 }}
    >
      {/* Sun */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute"
        initial={false}
        animate={{ opacity: dark ? 0 : 1, rotate: dark ? 90 : 0, scale: dark ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </motion.svg>

      {/* Moon */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute"
        initial={false}
        animate={{ opacity: dark ? 1 : 0, rotate: dark ? 0 : -90, scale: dark ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </motion.svg>
    </motion.button>
  );
}
