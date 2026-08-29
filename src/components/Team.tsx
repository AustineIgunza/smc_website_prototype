"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import type { TeamMember } from "@/data/team";
import {
  LinkedInIcon,
  XTwitterIcon,
  InstagramIcon,
  Globe,
  Mail,
} from "./icons";

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
      return <LinkedInIcon className="w-5 h-5" />;
    case "twitter":
    case "x":
      return <XTwitterIcon className="w-5 h-5" />;
    case "instagram":
      return <InstagramIcon className="w-5 h-5" />;
    default:
      return <Globe size={20} />;
  }
};

/* ── Avatar with optional profile picture ────────────── */
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
  const [imgError, setImgError] = useState(false);

  const hasPhoto = !!member.avatarUrl && !imgError;

  return (
    <div className="relative group/avatar">
      {/* Ambient glow behind avatar on hover */}
      {!prefersReduced && (
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover/avatar:opacity-50 transition-opacity duration-300 pointer-events-none ${
            hovered ? "opacity-50" : ""
          }`}
          style={{
            background: hasPhoto
              ? `radial-gradient(circle, rgba(255,168,41,0.6) 0%, rgba(204,136,2,0.4) 100%)`
              : `radial-gradient(circle, ${member.avatarGradient[0]} 0%, ${member.avatarGradient[1]} 100%)`,
            transform: "scale(1.1)",
          }}
        />
      )}
      <div
        className={`${dims} relative rounded-full flex items-center justify-center transition-all duration-300 border overflow-hidden ${
          active
            ? "ring-2 ring-amber ring-offset-2 ring-offset-teal border-transparent"
            : "border-white/20 dark:border-white/10 shadow-inner"
        } backdrop-blur-sm`}
        style={{
          background: hasPhoto
            ? "transparent"
            : `linear-gradient(135deg, ${member.avatarGradient[0]}, ${member.avatarGradient[1]})`,
          boxShadow: `0 8px 16px -4px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.2)`,
        }}
      >
        {hasPhoto ? (
          <motion.img
            src={member.avatarUrl}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgError(true)}
            animate={!prefersReduced && hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        ) : (
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
        )}
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
      {/* 2. Biography */}
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className={`font-body text-sm sm:text-base leading-relaxed ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {member.bio}
      </motion.p>
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

  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from database API
  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setTeamList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section
        className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
          dark ? "bg-teal" : "bg-cream"
        }`}
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className={`font-body ${dark ? "text-cream/45" : "text-navy/45"}`}>
            Loading team profiles...
          </p>
        </div>
      </section>
    );
  }

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
          {teamList.map((m) => (
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
