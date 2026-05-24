"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({
  target,
  suffix = "",
  duration = 2,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView || !ref.current) return;

    if (prefersReduced) {
      ref.current.textContent = target + suffix;
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = Math.round(value) + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, target, suffix, duration, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
