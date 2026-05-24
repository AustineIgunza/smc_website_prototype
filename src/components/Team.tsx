"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import { useTheme } from "./ThemeProvider";

const team = [
  {
    name: "Chairperson",
    role: "Overall club leadership and strategy",
    bio: "The Chairperson sets the vision and direction for SMC, coordinates with university administration, and ensures all departments work toward shared goals. They represent the club at external events and lead the executive board.",
  },
  {
    name: "Vice Chairperson",
    role: "Operations, partnerships, and member experience",
    bio: "The Vice Chairperson manages day-to-day operations, cultivates partnerships with brands and agencies, and oversees member onboarding and engagement programs to ensure every member gets value from SMC.",
  },
  {
    name: "Secretary General",
    role: "Communications, minutes, and documentation",
    bio: "The Secretary General handles all internal and external communications, maintains meeting records, manages the club's correspondence, and ensures institutional knowledge is preserved for future teams.",
  },
  {
    name: "Treasurer",
    role: "Budgets, finances, and sponsorship management",
    bio: "The Treasurer manages the club's financial health — from budgeting events to tracking sponsorship funds. They prepare financial reports and ensure transparency in all monetary matters.",
  },
  {
    name: "Director of Marketing",
    role: "Brand strategy, content, and social media",
    bio: "The Director of Marketing owns SMC's brand voice across all channels. They lead content strategy, manage social media campaigns, and ensure consistent messaging that grows the club's reach and reputation.",
  },
  {
    name: "Director of Events",
    role: "Planning, logistics, and event execution",
    bio: "The Director of Events brings SMC's calendar to life — from Marketing Week to Agency Nights. They handle venue logistics, speaker coordination, and ensure every event delivers a memorable experience.",
  },
  {
    name: "Director of Creatives",
    role: "Design, visual identity, and production",
    bio: "The Director of Creatives leads the design team in producing all visual assets — posters, social media graphics, event branding, and video content. They maintain SMC's visual identity and creative standards.",
  },
  {
    name: "Director of Research",
    role: "Market research, insights, and analytics",
    bio: "The Director of Research drives data-informed decision making. They lead market research projects, analyze campaign performance, and provide insights that shape SMC's strategic direction.",
  },
];

export default function Team() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (name: string) =>
    setExpanded((prev) => (prev === name ? null : name));

  return (
    <section id="team" className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Leadership
          </p>
          <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${
            dark ? "text-cream" : "text-navy"
          }`}>
            Meet the <span className="text-amber">Team</span>
          </h2>
          <p className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-16 ${
            dark ? "text-cream/60" : "text-navy/60"
          }`}>
            SMC is led by a passionate executive team of students who live and
            breathe marketing. Tap any role to learn more.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.08}>
          {team.map((m) => (
            <StaggerItem key={m.name}>
              <button
                onClick={() => toggle(m.name)}
                className={`group text-center p-4 sm:p-6 rounded-2xl border w-full text-left transition-all cursor-pointer ${
                  expanded === m.name
                    ? "border-amber/40 shadow-lg"
                    : "hover:border-amber/30 hover:shadow-md"
                } ${dark ? "border-cream/10" : "border-navy/10"}`}
              >
                <div className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-5 rounded-full flex items-center justify-center transition-colors ${
                  expanded === m.name
                    ? "bg-amber/20"
                    : dark ? "bg-cream/10" : "bg-teal/10"
                }`}>
                  <span className={`font-display text-xl sm:text-2xl font-bold ${
                    expanded === m.name
                      ? "text-amber"
                      : dark ? "text-cream" : "text-teal"
                  }`}>
                    {m.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
                <h3 className={`font-display text-sm sm:text-base font-bold mb-1 text-center ${
                  dark ? "text-cream" : "text-navy"
                }`}>
                  {m.name}
                </h3>
                <p className={`font-body text-xs sm:text-sm leading-relaxed text-center ${
                  dark ? "text-cream/50" : "text-navy/50"
                }`}>
                  {m.role}
                </p>

                <AnimatePresence>
                  {expanded === m.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-center ${
                        dark ? "border-cream/10" : "border-navy/10"
                      }`}>
                        <p className={`font-body text-xs sm:text-sm leading-relaxed ${
                          dark ? "text-cream/60" : "text-navy/60"
                        }`}>
                          {m.bio}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
