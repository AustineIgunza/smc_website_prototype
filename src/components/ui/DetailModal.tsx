"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { X } from "../icons";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const easing = [0.16, 1, 0.3, 1] as const;

export default function DetailModal({ open, onClose, children, title }: DetailModalProps) {
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      // Focus the panel after animation
      const timer = setTimeout(() => panelRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onKeyDown={handleKeyDown}>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Panel — slides up as sheet on mobile, scales in on desktop */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`relative z-10 w-full sm:max-w-2xl max-h-[85dvh] overflow-y-auto scrollbar-hide rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 outline-none ${
              dark
                ? "bg-teal border border-cream/10"
                : "bg-cream border border-navy/10"
            }`}
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 60, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 40, scale: 0.97 }
            }
            transition={{ duration: 0.35, ease: easing }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                dark
                  ? "text-cream/50 hover:text-cream hover:bg-cream/10"
                  : "text-navy/50 hover:text-navy hover:bg-navy/10"
              }`}
              aria-label="Close dialog"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
