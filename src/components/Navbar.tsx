"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

const links = [
  { label: "Home", href: "/" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `${dark ? "bg-white/95" : "bg-teal/95"} backdrop-blur-md shadow-lg py-2 sm:py-3`
          : `${dark ? "bg-white" : "bg-teal"} py-3 sm:py-5`
      }`}
      initial={prefersReduced ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <Logo variant="full" size={40} asLink onDarkBg={!dark} />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative font-body text-sm font-medium tracking-wide transition-colors py-1 ${
                dark
                  ? "text-teal/70 hover:text-teal"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 bg-amber rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side: theme toggle + Join Now + mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/membership"
            className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-full bg-amber text-teal font-body text-sm font-semibold tracking-wide hover:bg-gold transition-colors"
          >
            Join the Club
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 ${dark ? "text-teal" : "text-cream"}`}
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
          className={`md:hidden backdrop-blur-md border-t px-4 sm:px-6 pb-4 pt-3 ${
            dark
              ? "bg-white/95 border-teal/10"
              : "bg-teal/95 border-cream/10"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block py-3 font-body text-base font-medium transition-colors ${
                isActive(link.href)
                  ? "text-amber border-l-2 border-amber pl-3"
                  : dark
                    ? "text-teal/70 hover:text-teal"
                    : "text-cream/70 hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/membership"
            className="block mt-3 text-center px-5 py-3 rounded-full bg-amber text-teal font-body text-sm font-semibold tracking-wide hover:bg-gold transition-colors"
          >
            Join the Club
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
