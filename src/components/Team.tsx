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

/* ── Inline SVG Social Icons ────────────────────────── */
const LinkedInIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/>
  </svg>
);

const getSocialLink = (platform: string, handle: string) => {
  const cleanHandle = handle.startsWith("@") ? handle.substring(1) : handle;
  switch (platform.toLowerCase()) {
    case "linkedin":
      return `https://linkedin.com/in/${cleanHandle}`;
    case "twitter":
    case "x":
      return `https://twitter.com/${cleanHandle}`;
    case "instagram":
      return `https://instagram.com/${cleanHandle}`;
    default:
      return `https://google.com/search?q=${encodeURIComponent(handle)}`;
  }
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return <LinkedInIcon />;
    case "twitter":
    case "x":
      return <TwitterIcon />;
    case "instagram":
      return <InstagramIcon />;
    default:
      return <GlobeIcon />;
  }
};

/* ── Avatar placeholder with gradient ────────────────── */
function Avatar({
  member,
  size = "md",
  active = false,
  hovered = false,
}: {
  member: TeamMember;
  size?: "md" | "lg";
  active?: boolean;
  hovered?: boolean;
}) {
  // Scaled up dimensions: MD goes 16->20 & 20->24; LG goes 24->28 & 32->36
  const dims = size === "lg" ? "w-28 h-28 sm:w-36 sm:h-36" : "w-20 h-20 sm:w-24 sm:h-24";
  const textSize = size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl";
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative group/avatar">
      {/* Ambient glow behind avatar on hover */}
      {!prefersReduced && (
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover/avatar:opacity-50 transition-opacity duration-300 pointer-events-none ${
            hovered ? "opacity-50" : ""
          }`}
          style={{
            background: `radial-gradient(circle, ${member.avatarGradient[0]} 0%, ${member.avatarGradient[1]} 100%)`,
            transform: "scale(1.1)",
          }}
        />
      )}
      <div
        className={`${dims} relative rounded-full flex items-center justify-center transition-all duration-300 border ${
          active
            ? "ring-2 ring-amber ring-offset-2 ring-offset-teal border-transparent"
            : "border-white/20 dark:border-white/10 shadow-inner"
        } backdrop-blur-sm`}
        style={{
          background: `linear-gradient(135deg, ${member.avatarGradient[0]}, ${member.avatarGradient[1]})`,
          boxShadow: `0 8px 16px -4px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.2)`,
        }}
      >
        <motion.span
          className={`font-display ${textSize} font-bold text-white tracking-wider`}
          animate={!prefersReduced && hovered ? { scale: 1.12, rotate: 3 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {member.name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </motion.span>
      </div>
    </div>
  );
}

/* ── Content staggers animation variables for modal ──── */
const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};

/* ── Team member detail content ──────────────────────── */
function MemberDetail({ member }: { member: TeamMember }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="pr-4">
      {/* 1. Header with avatar & name */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={contentVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
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
      </motion.div>

      {/* 2. Biography */}
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {member.bio}
      </motion.p>

      {/* 3. Accent Quote block */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={contentVariants} className="relative pl-6 pr-2 py-4 mb-6 border-l-4 border-amber/70 dark:border-amber bg-amber/5 rounded-r-xl">
        <span className="absolute -top-2 left-2 font-accent text-5xl text-amber/20 dark:text-amber/10 pointer-events-none select-none">
          &ldquo;
        </span>
        <p className="font-accent text-lg sm:text-xl italic leading-relaxed text-navy/90 dark:text-cream/90 relative z-10">
          {member.quote}
        </p>
        <span className="absolute -bottom-6 right-4 font-accent text-5xl text-amber/20 dark:text-amber/10 pointer-events-none select-none">
          &rdquo;
        </span>
      </motion.div>

      {/* 4. Focus areas pills */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={contentVariants} className="mb-6">
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
              className={`font-body text-[11px] font-medium tracking-wide px-3 py-1 rounded-full border transition-colors ${
                dark
                  ? "bg-amber/5 border-amber/20 text-amber"
                  : "bg-gold/5 border-gold/10 text-gold"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 5. Social Connect icons */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={contentVariants}>
        <p
          className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
            dark ? "text-cream/40" : "text-navy/50"
          }`}
        >
          Connect
        </p>
        <div className="flex flex-wrap gap-3">
          {member.socials.map((s) => (
            <a
              key={s.platform}
              href={getSocialLink(s.platform, s.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${
                dark
                  ? "bg-cream/5 border-cream/10 text-cream/60 hover:text-amber hover:border-amber/45 hover:bg-amber/5 hover:scale-110"
                  : "bg-navy/5 border-navy/10 text-navy/60 hover:text-amber hover:border-amber/45 hover:bg-amber/5 hover:scale-110"
              }`}
              title={`${s.platform}: ${s.handle}`}
            >
              {getSocialIcon(s.platform)}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Team() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group team members (unused but kept for reference - removed to prevent ts compile warnings)

  return (
    <section
      id="team"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main Heading - Leadership (primary Display Title) */}
        <Reveal y={40}>
          <h1 className="font-accent text-amber text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-4 tracking-wide">
            Leadership
          </h1>
          <p
            className={`font-display text-xl sm:text-3xl text-center font-medium mb-6 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Meet the <span className="text-amber">Team</span>
          </p>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-12 sm:mb-20 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            SMC is led by a passionate executive team of students who live and
            breathe marketing. Click anyone to learn more.
          </p>
        </Reveal>

        {/* ── Executive Team Section ────────────────────── */}
        <Reveal y={40}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className={`font-display text-base sm:text-lg font-bold uppercase tracking-wider ${dark ? "text-amber" : "text-gold"}`}>
              Executive Team
            </h3>
            <div className={`h-[1px] flex-1 ${dark ? "bg-cream/10" : "bg-navy/10"}`} />
          </div>
        </Reveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          stagger={0.08}
        >
          {team.map((m) => (
            <StaggerItem key={m.id} y={40}>
              <ClickableCard
                onClick={() => setSelected(m)}
                cue="View profile"
                className="transition-all duration-300 hover:shadow-[0_16px_32px_rgba(255,168,41,0.08)] dark:hover:shadow-[0_16px_32px_rgba(255,168,41,0.15)]"
              >
                {/* Expanded card padding p-4->p-6, sm:p-6->sm:p-8 */}
                <div
                  className="p-6 sm:p-8 text-center"
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    className="mx-auto mb-5 w-fit"
                    whileHover={
                      prefersReduced ? {} : { scale: 1.06, transition: { duration: 0.2 } }
                    }
                  >
                    <Avatar member={m} hovered={hoveredId === m.id} />
                  </motion.div>
                  <h4
                    className={`font-display text-sm sm:text-base font-bold mb-1.5 ${
                      dark ? "text-cream" : "text-navy"
                    }`}
                  >
                    {m.name}
                  </h4>
                  <p className="font-body text-xs font-semibold text-amber mb-1">
                    {m.role}
                  </p>
                  <p
                    className={`font-body text-[11px] leading-relaxed ${
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
