export interface EventCategoryConfig {
  id: string;
  label: string;
  gradient: [string, string];
  bgBadge: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const EVENT_CATEGORIES: EventCategoryConfig[] = [
  {
    id: "Flagship & Summits",
    label: "Flagship & Summits",
    gradient: ["#FFA829", "#CC8802"],
    bgBadge: "bg-amber/10",
    textColor: "text-amber",
    borderColor: "border-amber/20",
    description: "Major annual club summits, fairs, roundtables, and headline collaborations.",
  },
  {
    id: "Corporate & Industry Visits",
    label: "Corporate & Industry Visits",
    gradient: ["#0284c7", "#0369a1"],
    bgBadge: "bg-sky-500/10",
    textColor: "text-sky-400",
    borderColor: "border-sky-500/20",
    description: "Industrial visits, showroom tours, and real estate development launches.",
  },
  {
    id: "CSR & Community Outreach",
    label: "CSR & Community Outreach",
    gradient: ["#059669", "#10b981"],
    bgBadge: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    description: "Charity fun runs, children's home visits, and sustainable community initiatives.",
  },
  {
    id: "Campus Life & Entertainment",
    label: "Campus Life & Entertainment",
    gradient: ["#a855f7", "#7c3aed"],
    bgBadge: "bg-purple-500/10",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    description: "Live concert performances, drama society plays, and arts marketing.",
  },
  {
    id: "Wellness & Culture",
    label: "Wellness & Culture",
    gradient: ["#ec4899", "#db2777"],
    bgBadge: "bg-pink-500/10",
    textColor: "text-pink-400",
    borderColor: "border-pink-500/20",
    description: "Multi-club wellness summits, mental health workshops, and vendor fairs.",
  },
  {
    id: "Academic & Institutional",
    label: "Academic & Institutional",
    gradient: ["#eab308", "#ca8a04"],
    bgBadge: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/20",
    description: "Dean's List ceremonies, academic recognitions, and university partnerships.",
  },
  {
    id: "Collaborations & Co-Marketing",
    label: "Collaborations & Co-Marketing",
    gradient: ["#14b8a6", "#0d9488"],
    bgBadge: "bg-teal-500/10",
    textColor: "text-teal-400",
    borderColor: "border-teal-500/20",
    description: "Inter-club campaigns, student recruitment fairs, and joint promotions.",
  },
  {
    id: "Workshops & Masterclasses",
    label: "Workshops & Masterclasses",
    gradient: ["#6366f1", "#4f46e5"],
    bgBadge: "bg-indigo-500/10",
    textColor: "text-indigo-400",
    borderColor: "border-indigo-500/20",
    description: "Hands-on masterclasses in digital branding, analytics, and strategy.",
  },
  {
    id: "Competitions & Hackathons",
    label: "Competitions & Hackathons",
    gradient: ["#f97316", "#ea580c"],
    bgBadge: "bg-orange-500/10",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    description: "Inter-university pitch competitions, hackathons, and brand challenges.",
  },
  {
    id: "Networking & Mixers",
    label: "Networking & Mixers",
    gradient: ["#3b82f6", "#2563eb"],
    bgBadge: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    description: "Agency nights, alumni mixers, and industry leader roundtables.",
  },
];

export const DEFAULT_CATEGORY_GRADIENT: [string, string] = ["#013953", "#00313F"];

export function getCategoryGradient(category: string): [string, string] {
  if (!category) return DEFAULT_CATEGORY_GRADIENT;
  const match = EVENT_CATEGORIES.find(
    (c) =>
      c.id.toLowerCase() === category.toLowerCase() ||
      c.label.toLowerCase() === category.toLowerCase() ||
      category.toLowerCase().includes(c.id.toLowerCase()) ||
      c.id.toLowerCase().includes(category.toLowerCase())
  );
  return match ? match.gradient : DEFAULT_CATEGORY_GRADIENT;
}

export function getCategoryBadgeStyle(category: string): {
  bgBadge: string;
  textColor: string;
  borderColor: string;
} {
  const match = EVENT_CATEGORIES.find(
    (c) =>
      c.id.toLowerCase() === category?.toLowerCase() ||
      c.label.toLowerCase() === category?.toLowerCase() ||
      category?.toLowerCase().includes(c.id.toLowerCase()) ||
      c.id.toLowerCase().includes(category?.toLowerCase())
  );
  if (match) {
    return {
      bgBadge: match.bgBadge,
      textColor: match.textColor,
      borderColor: match.borderColor,
    };
  }
  return {
    bgBadge: "bg-amber/10",
    textColor: "text-amber",
    borderColor: "border-amber/20",
  };
}
