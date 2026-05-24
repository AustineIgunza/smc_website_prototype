"use client";

import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const events = [
  {
    tag: "Flagship",
    title: "Marketing Week",
    date: "September 2026",
    desc: "A week-long immersion featuring industry panels, brand challenges, and the annual pitch competition.",
  },
  {
    tag: "Workshop",
    title: "Digital Strategy Bootcamp",
    date: "Monthly",
    desc: "Hands-on sessions covering SEO, social media analytics, paid ads, and content calendars.",
  },
  {
    tag: "Networking",
    title: "Agency Nights",
    date: "Quarterly",
    desc: "Intimate evenings with agency leaders — hear their stories, ask your questions, make connections.",
  },
  {
    tag: "Competition",
    title: "Brand Challenge",
    date: "Bi-Annual",
    desc: "Teams compete to solve a real brand brief. Winners present to the client's marketing team.",
  },
];

export default function Events() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section id="events" className={`relative overflow-hidden pt-32 pb-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="grid" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Events
          </p>
          <h2 className={`font-display text-4xl md:text-5xl font-bold text-center mb-4 ${
            dark ? "text-cream" : "text-navy"
          }`}>
            What We <span className="text-amber">Do</span>
          </h2>
          <p className={`font-body text-lg text-center max-w-2xl mx-auto mb-16 ${
            dark ? "text-cream/60" : "text-navy/60"
          }`}>
            From workshops to competitions, every event is designed to stretch
            your thinking and build real skills.
          </p>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-2 gap-8" stagger={0.15}>
          {events.map((e) => (
            <StaggerItem key={e.title}>
              <div className={`group border rounded-2xl p-8 h-full hover:border-amber/40 hover:shadow-lg transition-all ${
                dark ? "border-cream/10" : "border-navy/10"
              }`}>
                <span className="inline-block font-body text-xs font-semibold tracking-widest uppercase bg-amber/10 text-amber px-3 py-1 rounded-full mb-4">
                  {e.tag}
                </span>
                <h3 className={`font-display text-2xl font-bold mb-2 ${
                  dark ? "text-cream" : "text-navy"
                }`}>
                  {e.title}
                </h3>
                <p className={`font-body text-sm font-medium mb-3 ${
                  dark ? "text-cream/40" : "text-navy/40"
                }`}>
                  {e.date}
                </p>
                <p className={`font-body leading-relaxed ${
                  dark ? "text-cream/65" : "text-navy/65"
                }`}>
                  {e.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
