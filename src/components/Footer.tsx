"use client";

import Link from "next/link";
import Logo from "./Logo";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";
import {
  InstagramIcon,
  LinkedInIcon,
  XTwitterIcon,
  TikTokIcon,
  ArrowUpRight,
  ArrowUp,
} from "./icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Membership", href: "/membership" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Past Events & Gallery", href: "/events/past" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
];

const socials = [
  { label: "Instagram", href: "#", icon: <InstagramIcon size={16} /> },
  { label: "LinkedIn", href: "#", icon: <LinkedInIcon size={16} /> },
  { label: "Twitter / X", href: "#", icon: <XTwitterIcon size={16} /> },
  { label: "TikTok", href: "#", icon: <TikTokIcon size={16} /> },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <footer className={`relative overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-8 ${
      dark ? "bg-teal" : "bg-navy"
    }`}>
      <AnimatedBg variant="dots" surface={dark ? "teal" : "navy"} intensity={0.5} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-14">
          {/* Brand */}
          <div className="lg:max-w-sm">
            <Logo variant="full" size={60} onDarkBg />
            <p className="font-body text-cream/50 text-sm mt-4 leading-relaxed">
              The premier launchpad for the next generation of marketing talent
              at Strathmore University.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-cream text-sm font-bold uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-body text-cream/50 hover:text-amber text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-cream text-sm font-bold uppercase tracking-widest mb-4">
              Follow Us
            </h4>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="font-body text-cream/50 hover:text-amber text-sm transition-colors flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-amber/70">{s.icon}</span>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright + back to top */}
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Strathmore Marketing Club. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="font-body text-cream/30 hover:text-amber text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <span>Back to Top</span>
            <ArrowUp size={12} className="shrink-0" />
          </button>
        </div>
      </div>
    </footer>
  );
}
