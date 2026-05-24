"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import Button from "./ui/Button";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const benefits = [
  {
    icon: "\u{1F3AF}",
    title: "Live Campaigns",
    desc: "Work on real briefs from real brands \u2014 build a portfolio that speaks for itself.",
  },
  {
    icon: "\u{1F9E0}",
    title: "Workshops & Masterclasses",
    desc: "Learn from industry professionals in branding, analytics, copywriting, and more.",
  },
  {
    icon: "\u{1F91D}",
    title: "Networking",
    desc: "Connect with alumni, agency leaders, and fellow marketing enthusiasts across Kenya.",
  },
  {
    icon: "\u{1F3C6}",
    title: "Competitions",
    desc: "Represent Strathmore in national and pan-African marketing competitions.",
  },
  {
    icon: "\u{1F4C8}",
    title: "Career Access",
    desc: "Exclusive internship pipelines and mentorship from marketing professionals.",
  },
  {
    icon: "\u{1F3A8}",
    title: "Creative Freedom",
    desc: "Pitch ideas, lead projects, and bring your creative vision to life with a team behind you.",
  },
];

export default function Membership() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section id="membership" className={`relative overflow-hidden pt-32 pb-24 ${dark ? "bg-navy" : "bg-cream"}`}>
      <AnimatedBg variant="mesh" surface={dark ? "navy" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Membership
          </p>
          <h2 className={`font-display text-4xl md:text-5xl font-bold text-center mb-4 ${
            dark ? "text-cream" : "text-navy"
          }`}>
            Why Join <span className="text-amber">SMC</span>?
          </h2>
          <p className={`font-body text-lg text-center max-w-2xl mx-auto mb-16 ${
            dark ? "text-cream/60" : "text-navy/60"
          }`}>
            Membership isn&apos;t just a card — it&apos;s access to a launchpad
            that accelerates your marketing career from day one.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <div className={`border rounded-2xl p-8 h-full hover:border-amber/30 transition-colors ${
                dark
                  ? "bg-teal/50 border-cream/10"
                  : "bg-teal/5 border-navy/10"
              }`}>
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <h3 className={`font-display text-xl font-bold mb-3 ${
                  dark ? "text-cream" : "text-navy"
                }`}>
                  {b.title}
                </h3>
                <p className={`font-body leading-relaxed ${
                  dark ? "text-cream/60" : "text-navy/60"
                }`}>
                  {b.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="text-center mt-14">
            <Button variant="primary" href="/membership">
              Become a Member
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
