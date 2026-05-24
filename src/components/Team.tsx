"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const team = [
  { name: "Chairperson", role: "Overall club leadership and strategy" },
  { name: "Vice Chairperson", role: "Operations, partnerships, and member experience" },
  { name: "Secretary General", role: "Communications, minutes, and documentation" },
  { name: "Treasurer", role: "Budgets, finances, and sponsorship management" },
  { name: "Director of Marketing", role: "Brand strategy, content, and social media" },
  { name: "Director of Events", role: "Planning, logistics, and event execution" },
  { name: "Director of Creatives", role: "Design, visual identity, and production" },
  { name: "Director of Research", role: "Market research, insights, and analytics" },
];

export default function Team() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section id="team" className={`relative overflow-hidden pt-32 pb-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Leadership
          </p>
          <h2 className={`font-display text-4xl md:text-5xl font-bold text-center mb-4 ${
            dark ? "text-cream" : "text-navy"
          }`}>
            Meet the <span className="text-amber">Team</span>
          </h2>
          <p className={`font-body text-lg text-center max-w-2xl mx-auto mb-16 ${
            dark ? "text-cream/60" : "text-navy/60"
          }`}>
            SMC is led by a passionate executive team of students who live and
            breathe marketing.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.08}>
          {team.map((m) => (
            <StaggerItem key={m.name}>
              <div className={`group text-center p-6 rounded-2xl border hover:border-amber/30 hover:shadow-md transition-all ${
                dark ? "border-cream/10" : "border-navy/10"
              }`}>
                <div className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center ${
                  dark ? "bg-cream/10" : "bg-teal/10"
                }`}>
                  <span className={`font-display text-2xl font-bold ${
                    dark ? "text-cream" : "text-teal"
                  }`}>
                    {m.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
                <h3 className={`font-display text-base font-bold mb-1 ${
                  dark ? "text-cream" : "text-navy"
                }`}>
                  {m.name}
                </h3>
                <p className={`font-body text-sm leading-relaxed ${
                  dark ? "text-cream/50" : "text-navy/50"
                }`}>
                  {m.role}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
