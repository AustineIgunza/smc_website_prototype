"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import Button from "./ui/Button";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const projects = [
  {
    title: "Rebrand Sprint \u2014 Campus Caf\u00E9",
    category: "Branding",
    desc: "Full visual identity overhaul: logo, menu design, social media templates, and launch campaign.",
  },
  {
    title: "Social Media Takeover \u2014 SU Fest",
    category: "Digital Marketing",
    desc: "Managed end-to-end social strategy for the university festival \u2014 40k+ impressions in 3 days.",
  },
  {
    title: "Market Research \u2014 Fintech Startup",
    category: "Research & Strategy",
    desc: "Conducted primary research and competitor analysis to inform a go-to-market strategy for a Nairobi fintech.",
  },
  {
    title: "Content Series \u2014 \"Marketing Decoded\"",
    category: "Content Creation",
    desc: "Weekly Instagram carousel series breaking down marketing concepts \u2014 grew SMC page by 2k followers.",
  },
  {
    title: "Pitch Deck \u2014 National Brand Challenge",
    category: "Campaign Strategy",
    desc: "Built and presented a full campaign pitch for a FMCG brand at a national inter-university competition.",
  },
  {
    title: "Event Branding \u2014 Marketing Week 2025",
    category: "Design & Production",
    desc: "Designed all event collateral: banners, lanyards, social kits, and a 40-page post-event report.",
  },
];

export default function Portfolio() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section id="portfolio" className={`relative overflow-hidden pt-32 pb-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="diagonals" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Portfolio
          </p>
          <h2 className={`font-display text-4xl md:text-5xl font-bold text-center mb-4 ${
            dark ? "text-cream" : "text-navy"
          }`}>
            Our <span className="text-amber">Work</span>
          </h2>
          <p className={`font-body text-lg text-center max-w-2xl mx-auto mb-16 ${
            dark ? "text-cream/60" : "text-navy/60"
          }`}>
            Real projects. Real brands. Real results. Here&apos;s a glimpse of
            what SMC members have built.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {projects.map((p) => (
            <StaggerItem key={p.title}>
              <div className={`border rounded-2xl p-7 h-full hover:border-amber/20 transition-colors ${
                dark
                  ? "bg-navy/30 border-cream/5"
                  : "bg-teal/5 border-navy/10"
              }`}>
                <span className={`inline-block font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
                  dark ? "text-gold" : "text-amber"
                }`}>
                  {p.category}
                </span>
                <h3 className={`font-display text-lg font-bold mb-3 leading-snug ${
                  dark ? "text-cream" : "text-navy"
                }`}>
                  {p.title}
                </h3>
                <p className={`font-body text-sm leading-relaxed ${
                  dark ? "text-cream/50" : "text-navy/50"
                }`}>
                  {p.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="text-center mt-14">
            <Button variant="outline" href="/portfolio">
              Work With Us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
