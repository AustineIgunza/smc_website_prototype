"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "./Logo";
import Button from "./ui/Button";

const links = [
  { label: "Home", href: "#" },
  { label: "Membership", href: "#membership" },
  { label: "Events", href: "#events" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Team", href: "#team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-teal/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
      initial={prefersReduced ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo — mark only in nav for compact look */}
        <Logo variant="mark" theme="dark" size={80} asLink />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-cream/70 hover:text-amber font-body text-sm font-medium tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <Button variant="primary" href="#join" className="hidden md:inline-flex">
            Join the Club
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cream p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden bg-teal/95 backdrop-blur-md border-t border-cream/10 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-cream/80 hover:text-amber font-body text-base font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" href="#join" className="mt-4 w-full">
            Join the Club
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
}
