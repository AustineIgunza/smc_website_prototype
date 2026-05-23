"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  stagger?: number;
}

const easing = [0.16, 1, 0.3, 1] as const;

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.8,
  once = true,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        prefersReduced
          ? {}
          : {
              hidden: { opacity: 0, y },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
            }
      }
    >
      {children}
    </motion.div>
  );
}
