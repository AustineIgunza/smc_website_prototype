"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import { team, type TeamMember } from "@/data/team";

/* ── Avatar placeholder with gradient ────────────────── */
function Avatar({
  member,
  size = "md",
  active = false,
}: {
  member: TeamMember;
  size?: "md" | "lg";
  active?: boolean;
}) {
  const dims = size === "lg" ? "w-24 h-24 sm:w-32 sm:h-32" : "w-16 h-16 sm:w-20 sm:h-20";
  const textSize = size === "lg" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl";

  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center transition-all duration-300 ${
        active ? "ring-2 ring-amber ring-offset-2 ring-offset-teal" : ""
      }`}
      style={{
        background: `linear-gradient(135deg, ${member.avatarGradient[0]}, ${member.avatarGradient[1]})`,
      }}
    >
      <span className={`font-display ${textSize} font-bold text-white`}>
        {member.name
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </span>
    </div>
  );
}

/* ── Team member detail content ──────────────────────── */
function MemberDetail({ member }: { member: TeamMember }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="pr-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
        <Avatar member={member} size="lg" />
        <div className="text-center sm:text-left">
          <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-amber mb-1">
            {member.role}
          </p>
          <h3
            className={`font-display text-xl sm:text-2xl font-bold mb-1 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            {member.name}
          </h3>
          <p className={`font-body text-sm ${dark ? "text-cream/50" : "text-navy/60"}`}>
            {member.course} &middot; {member.year}
          </p>
        </div>
      </div>

      <p
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {member.bio}
      </p>

      {/* Quote */}
      <div className={`border-l-2 border-amber pl-4 mb-6`}>
        <p
          className={`font-body text-sm italic leading-relaxed ${
            dark ? "text-cream/60" : "text-navy/70"
          }`}
        >
          &ldquo;{member.quote}&rdquo;
        </p>
      </div>

      {/* Focus areas */}
      <div className="mb-6">
        <p
          className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
            dark ? "text-cream/40" : "text-navy/50"
          }`}
        >
          Focus Areas
        </p>
        <div className="flex flex-wrap gap-2">
          {member.focus.map((f) => (
            <span
              key={f}
              className={`font-body text-xs px-3 py-1 rounded-full ${
                dark ? "bg-cream/5 text-cream/60" : "bg-navy/5 text-navy/70"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Socials */}
      <div>
        <p
          className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
            dark ? "text-cream/40" : "text-navy/50"
          }`}
        >
          Connect
        </p>
        <div className="flex flex-wrap gap-3">
          {member.socials.map((s) => (
            <span
              key={s.platform}
              className={`font-body text-sm font-medium ${
                dark ? "text-amber" : "text-amber"
              }`}
            >
              {s.platform}: {s.handle}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Team() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <section
      id="team"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Leadership
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Meet the <span className="text-amber">Team</span>
          </h2>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-16 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            SMC is led by a passionate executive team of students who live and
            breathe marketing. Click anyone to learn more.
          </p>
        </Reveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          stagger={0.08}
        >
          {team.map((m) => (
            <StaggerItem key={m.id}>
              <ClickableCard onClick={() => setSelected(m)} cue="View profile">
                <div className="p-4 sm:p-6 text-center">
                  <motion.div
                    className="mx-auto mb-3 sm:mb-4 w-fit"
                    whileHover={
                      prefersReduced ? {} : { scale: 1.08, transition: { duration: 0.25 } }
                    }
                  >
                    <Avatar member={m} />
                  </motion.div>
                  <h3
                    className={`font-display text-sm sm:text-base font-bold mb-1 ${
                      dark ? "text-cream" : "text-navy"
                    }`}
                  >
                    {m.name}
                  </h3>
                  <p className="font-body text-xs font-semibold text-amber mb-1">
                    {m.role}
                  </p>
                  <p
                    className={`font-body text-xs leading-relaxed ${
                      dark ? "text-cream/50" : "text-navy/60"
                    }`}
                  >
                    {m.title}
                  </p>
                </div>
              </ClickableCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && <MemberDetail member={selected} />}
      </DetailModal>
    </section>
  );
}
