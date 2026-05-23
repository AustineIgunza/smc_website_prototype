"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = "primary", href, className = "", onClick }: ButtonProps) {
  const prefersReduced = useReducedMotion();
  const base = "inline-flex items-center justify-center px-7 py-3.5 rounded-full font-body font-semibold text-sm tracking-wide transition-colors cursor-pointer";
  const variants = {
    primary: "bg-amber text-teal hover:bg-gold",
    outline: "border-2 border-cream/40 text-cream hover:bg-cream/10",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={prefersReduced ? {} : { scale: 1.03 }}
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </Component>
  );
}
