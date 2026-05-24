"use client";

import Link from "next/link";
import Logo from "./Logo";
import AnimatedBg from "./ui/AnimatedBg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "TikTok", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal pt-16 pb-8">
      <AnimatedBg variant="dots" surface="teal" intensity={0.5} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div>
            <Logo variant="full" size={60} />
            <p className="font-body text-cream/50 text-sm mt-4 leading-relaxed max-w-xs">
              The premier launchpad for the next generation of marketing talent
              at Strathmore University, Kenya.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-cream text-sm font-bold uppercase tracking-widest mb-4">
              Navigate
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

          {/* Socials */}
          <div>
            <h4 className="font-display text-cream text-sm font-bold uppercase tracking-widest mb-4">
              Follow Us
            </h4>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="font-body text-cream/50 hover:text-amber text-sm transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Strathmore Marketing Club. All
            rights reserved.
          </p>
          <p className="font-body text-cream/30 text-xs">
            Strathmore University, Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
