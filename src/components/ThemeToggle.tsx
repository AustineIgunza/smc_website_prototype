"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "@/components/icons";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const prefersReduced = useReducedMotion();
  const dark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        dark
          ? "text-teal hover:bg-teal/10"
          : "text-cream hover:bg-cream/10"
      }`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={prefersReduced ? {} : { scale: 0.9 }}
    >
      {/* Sun */}
      <motion.div
        className="absolute flex items-center justify-center"
        initial={false}
        animate={{ opacity: dark ? 0 : 1, rotate: dark ? 90 : 0, scale: dark ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Sun size={20} />
      </motion.div>

      {/* Moon */}
      <motion.div
        className="absolute flex items-center justify-center"
        initial={false}
        animate={{ opacity: dark ? 1 : 0, rotate: dark ? 0 : -90, scale: dark ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <Moon size={20} />
      </motion.div>
    </motion.button>
  );
}

