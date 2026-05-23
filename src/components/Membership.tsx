"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import Button from "./ui/Button";

const benefits = [
  {
    icon: "🎯",
    title: "Live Campaigns",
    desc: "Work on real briefs from real brands — build a portfolio that speaks for itself.",
  },
  {
    icon: "🧠",
    title: "Workshops & Masterclasses",
    desc: "Learn from industry professionals in branding, analytics, copywriting, and more.",
  },
  {
    icon: "🤝",
    title: "Networking",
    desc: "Connect with alumni, agency leaders, and fellow marketing enthusiasts across Kenya.",
  },
  {
    icon: "🏆",
    title: "Competitions",
    desc: "Represent Strathmore in national and pan-African marketing competitions.",
  },
  {
    icon: "📈",
    title: "Career Access",
    desc: "Exclusive internship pipelines and mentorship from marketing professionals.",
  },
  {
    icon: "🎨",
    title: "Creative Freedom",
    desc: "Pitch ideas, lead projects, and bring your creative vision to life with a team behind you.",
  },
];

export default function Membership() {
  return (
    <section id="membership" className="py-24 bg-teal">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Membership
          </p>
          <h2 className="font-display text-cream text-4xl md:text-5xl font-bold text-center mb-4">
            Why Join <span className="text-amber">SMC</span>?
          </h2>
          <p className="font-body text-cream/60 text-lg text-center max-w-2xl mx-auto mb-16">
            Membership isn&apos;t just a card — it&apos;s access to a launchpad
            that accelerates your marketing career from day one.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <div className="bg-navy/30 border border-cream/10 rounded-2xl p-8 h-full hover:border-amber/30 transition-colors">
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <h3 className="font-display text-cream text-xl font-bold mb-3">
                  {b.title}
                </h3>
                <p className="font-body text-cream/60 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="text-center mt-14">
            <Button variant="primary" href="#join">
              Become a Member
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
