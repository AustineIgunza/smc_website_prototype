"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import Button from "./ui/Button";

const projects = [
  {
    title: "Rebrand Sprint — Campus Café",
    category: "Branding",
    desc: "Full visual identity overhaul: logo, menu design, social media templates, and launch campaign.",
  },
  {
    title: "Social Media Takeover — SU Fest",
    category: "Digital Marketing",
    desc: "Managed end-to-end social strategy for the university festival — 40k+ impressions in 3 days.",
  },
  {
    title: "Market Research — Fintech Startup",
    category: "Research & Strategy",
    desc: "Conducted primary research and competitor analysis to inform a go-to-market strategy for a Nairobi fintech.",
  },
  {
    title: "Content Series — \"Marketing Decoded\"",
    category: "Content Creation",
    desc: "Weekly Instagram carousel series breaking down marketing concepts — grew SMC page by 2k followers.",
  },
  {
    title: "Pitch Deck — National Brand Challenge",
    category: "Campaign Strategy",
    desc: "Built and presented a full campaign pitch for a FMCG brand at a national inter-university competition.",
  },
  {
    title: "Event Branding — Marketing Week 2025",
    category: "Design & Production",
    desc: "Designed all event collateral: banners, lanyards, social kits, and a 40-page post-event report.",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-navy">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Portfolio
          </p>
          <h2 className="font-display text-cream text-4xl md:text-5xl font-bold text-center mb-4">
            Our <span className="text-amber">Work</span>
          </h2>
          <p className="font-body text-cream/60 text-lg text-center max-w-2xl mx-auto mb-16">
            Real projects. Real brands. Real results. Here&apos;s a glimpse of
            what SMC members have built.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {projects.map((p) => (
            <StaggerItem key={p.title}>
              <div className="bg-teal/50 border border-cream/5 rounded-2xl p-7 h-full hover:border-amber/20 transition-colors">
                <span className="inline-block font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3">
                  {p.category}
                </span>
                <h3 className="font-display text-cream text-lg font-bold mb-3 leading-snug">
                  {p.title}
                </h3>
                <p className="font-body text-cream/50 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="text-center mt-14">
            <Button variant="outline" href="#contact">
              Work With Us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
