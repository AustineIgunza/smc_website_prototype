"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../ThemeProvider";

type Variant = "waves" | "dots" | "grid" | "circles" | "mesh" | "diagonals";
type Surface = "cream" | "teal" | "navy";

interface AnimatedBgProps {
  variant: Variant;
  surface: Surface;
  intensity?: number;
  className?: string;
}

const COLORS = {
  cream: "#F3F2EA",
  teal: "#00313F",
  navy: "#013953",
  amber: "#FFA829",
};

function getDecoStyle(surface: Surface, dark: boolean): { color: string; boost: number } {
  // Light mode on cream needs higher opacity — teal on cream is lower contrast
  if (surface === "cream" && !dark) return { color: COLORS.teal, boost: 3 };
  return { color: COLORS.cream, boost: 1 };
}

/* ── Waves ─────────────────────────────────────────── */
function WavesBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.08 * intensity;
  const layers = [
    { d: "M0,60 C320,120 640,20 960,80 C1280,140 1600,40 1920,100 L1920,400 L0,400Z", opacity: base, dur: 8, y: 15 },
    { d: "M0,100 C240,40 480,140 720,80 C960,20 1200,120 1440,60 C1680,0 1920,100 1920,100 L1920,400 L0,400Z", opacity: base * 0.7, dur: 10, y: 20 },
    { d: "M0,140 C360,80 720,160 1080,100 C1440,40 1800,120 1920,140 L1920,400 L0,400Z", opacity: base * 0.5, dur: 12, y: 10 },
  ];

  return (
    <svg viewBox="0 0 1920 400" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[60%]">
      {layers.map((l, i) => (
        <motion.path
          key={i}
          d={l.d}
          fill={color}
          fillOpacity={l.opacity}
          initial={false}
          animate={reduced ? {} : { translateY: [0, -l.y, 0] }}
          transition={reduced ? {} : { duration: l.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ── Dots ──────────────────────────────────────────── */
function DotsBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.06 * intensity;
  const id = `dots-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      initial={false}
      animate={reduced ? {} : { opacity: [base, base * 1.8, base] }}
      transition={reduced ? {} : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={reduced ? { opacity: base } : undefined}
    >
      <defs>
        <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </motion.svg>
  );
}

/* ── Grid ──────────────────────────────────────────── */
function GridBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.08 * intensity;
  const spacing = 60;
  const lines = [];
  for (let i = 0; i <= 40; i++) {
    lines.push(
      <line key={`h${i}`} x1="0" y1={i * spacing} x2="2400" y2={i * spacing} stroke={color} strokeWidth="0.5" />,
      <line key={`v${i}`} x1={i * spacing} y1="0" x2={i * spacing} y2="2400" stroke={color} strokeWidth="0.5" />,
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: base }}>
      <motion.g
        initial={false}
        animate={reduced ? {} : { translateY: [0, -spacing, 0] }}
        transition={reduced ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {lines}
      </motion.g>
    </svg>
  );
}

/* ── Circles ───────────────────────────────────────── */
function CirclesBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.06 * intensity;
  const rings = [
    { r: 300, delay: 0 },
    { r: 220, delay: 2 },
    { r: 140, delay: 4 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ opacity: base }}>
      {rings.map((ring, i) => (
        <motion.circle
          key={i}
          cx="80%"
          cy="50%"
          r={ring.r}
          fill="none"
          stroke={color}
          strokeWidth="1"
          initial={false}
          animate={reduced ? {} : { scale: [1, 1.08, 1] }}
          transition={reduced ? {} : { duration: 10, repeat: Infinity, ease: "easeInOut", delay: ring.delay }}
        />
      ))}
    </svg>
  );
}

/* ── Mesh ──────────────────────────────────────────── */
function MeshBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.15 * intensity;
  const id = `mesh-${Math.random().toString(36).slice(2, 8)}`;
  const blobs = [
    { x: 150, y: 100, r: 350, dx: 100, dy: 60, dur: 12 },
    { x: 700, y: 250, r: 300, dx: -80, dy: 80, dur: 15 },
    { x: 400, y: 350, r: 250, dx: 60, dy: -50, dur: 10 },
    { x: 850, y: 100, r: 200, dx: -60, dy: 40, dur: 13 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
      <defs>
        {blobs.map((_, i) => (
          <radialGradient key={i} id={`${id}-${i}`}>
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="70%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {blobs.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={b.r}
          fill={`url(#${id}-${i})`}
          opacity={base}
          initial={false}
          animate={reduced ? {} : {
            cx: [b.x, b.x + b.dx, b.x],
            cy: [b.y, b.y + b.dy, b.y],
          }}
          transition={reduced ? {} : { duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ── Diagonals ─────────────────────────────────────── */
function DiagonalsBg({ color, intensity, reduced }: VariantProps) {
  const base = 0.08 * intensity;
  const spacing = 40;
  const lines = [];
  for (let i = -20; i <= 60; i++) {
    lines.push(
      <line
        key={i}
        x1={i * spacing}
        y1="0"
        x2={i * spacing + 1200}
        y2="1200"
        stroke={color}
        strokeWidth="0.5"
      />,
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: base }}>
      <motion.g
        initial={false}
        animate={reduced ? {} : { translateX: [0, spacing, 0] }}
        transition={reduced ? {} : { duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {lines}
      </motion.g>
    </svg>
  );
}

/* ── Variant props type ────────────────────────────── */
interface VariantProps {
  color: string;
  intensity: number;
  reduced: boolean;
}

/* ── Main component ────────────────────────────────── */
const variantMap: Record<Variant, React.FC<VariantProps>> = {
  waves: WavesBg,
  dots: DotsBg,
  grid: GridBg,
  circles: CirclesBg,
  mesh: MeshBg,
  diagonals: DiagonalsBg,
};

export default function AnimatedBg({
  variant,
  surface,
  intensity = 1,
  className = "",
}: AnimatedBgProps) {
  const { theme } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const dark = theme === "dark";
  const { color, boost } = getDecoStyle(surface, dark);
  const VariantComponent = variantMap[variant];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <VariantComponent color={color} intensity={intensity * boost} reduced={reduced} />
    </div>
  );
}
