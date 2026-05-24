"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { StaggerContainer, StaggerItem } from "./ui/Reveal";
import AnimatedBg from "./ui/AnimatedBg";
import ClickableCard from "./ui/ClickableCard";
import DetailModal from "./ui/DetailModal";
import { useTheme } from "./ThemeProvider";
import { benefits, type Benefit } from "@/data/membership";

/* ── Benefit detail content ──────────────────────────── */
function BenefitDetail({ benefit }: { benefit: Benefit }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="pr-4">
      <span className="text-4xl mb-4 block">{benefit.icon}</span>
      <h3
        className={`font-display text-xl sm:text-2xl font-bold mb-2 ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {benefit.title}
      </h3>
      <p
        className={`font-body text-sm sm:text-base leading-relaxed mb-6 ${
          dark ? "text-cream/70" : "text-navy/80"
        }`}
      >
        {benefit.longDesc}
      </p>

      <p
        className={`font-body text-xs font-semibold tracking-widest uppercase mb-3 ${
          dark ? "text-cream/40" : "text-navy/50"
        }`}
      >
        What You Get
      </p>
      <ul className="space-y-2">
        {benefit.highlights.map((h, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-1 w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFA829"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <span
              className={`font-body text-sm leading-relaxed ${
                dark ? "text-cream/65" : "text-navy/75"
              }`}
            >
              {h}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function Membership() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState<Benefit | null>(null);

  return (
    <section
      id="membership"
      className={`relative overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-24 ${
        dark ? "bg-navy" : "bg-cream"
      }`}
    >
      <AnimatedBg variant="mesh" surface={dark ? "navy" : "cream"} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4 text-center">
            Membership
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-4 ${
              dark ? "text-cream" : "text-navy"
            }`}
          >
            Why Join <span className="text-amber">SMC</span>?
          </h2>
          <p
            className={`font-body text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-16 ${
              dark ? "text-cream/60" : "text-navy/75"
            }`}
          >
            Membership isn&apos;t just a card &mdash; it&apos;s access to a
            launchpad that accelerates your marketing career from day one.
          </p>
        </Reveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          stagger={0.1}
        >
          {benefits.map((b) => (
            <StaggerItem key={b.id}>
              <ClickableCard onClick={() => setSelected(b)} cue="Learn more">
                <div
                  className={`p-5 sm:p-7 h-full ${
                    dark ? "bg-teal/50" : ""
                  }`}
                >
                  <motion.span
                    className="text-2xl sm:text-3xl mb-3 sm:mb-4 block"
                    whileHover={
                      prefersReduced ? {} : { scale: 1.15, rotate: 5, transition: { duration: 0.25 } }
                    }
                  >
                    {b.icon}
                  </motion.span>
                  <h3
                    className={`font-display text-lg sm:text-xl font-bold mb-2 ${
                      dark ? "text-cream" : "text-navy"
                    }`}
                  >
                    {b.title}
                  </h3>
                  <p
                    className={`font-body text-sm sm:text-base leading-relaxed ${
                      dark ? "text-cream/60" : "text-navy/75"
                    }`}
                  >
                    {b.desc}
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
        title={selected?.title}
      >
        {selected && <BenefitDetail benefit={selected} />}
      </DetailModal>
    </section>
  );
}
