export interface ProjectCategoryConfig {
  id: string;
  label: string;
  gradient: [string, string];
  bgBadge: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const PROJECT_CATEGORIES: ProjectCategoryConfig[] = [
  {
    id: "flagship",
    label: "Flagship Events",
    gradient: ["#FFA829", "#CC8802"],
    bgBadge: "bg-amber/10",
    textColor: "text-amber",
    borderColor: "border-amber/20",
    description: "Headline summits, roundtables, and fairs that define the club's year.",
  },
  {
    id: "corporate",
    label: "Corporate Partnerships",
    gradient: ["#013953", "#00313F"],
    bgBadge: "bg-navy/10",
    textColor: "text-sky-400",
    borderColor: "border-sky-500/20",
    description: "Brand collaborations, industrial visits, and co-marketing partnerships.",
  },
  {
    id: "community",
    label: "Community & CSR",
    gradient: ["#00313F", "#F3F2EA"],
    bgBadge: "bg-teal-500/10",
    textColor: "text-teal-400",
    borderColor: "border-teal-500/20",
    description: "Outreach drives, fundraising runs, and wellness initiatives for the wider community.",
  },
  {
    id: "campus",
    label: "Campus & Entertainment",
    gradient: ["#CC8802", "#FFA829"],
    bgBadge: "bg-gold/10",
    textColor: "text-gold",
    borderColor: "border-gold/20",
    description: "Concerts, drama productions, recruitment fairs, and student recognition.",
  },
];

export const DEFAULT_PROJECT_GRADIENT: [string, string] = ["#013953", "#00313F"];

export function getProjectCategory(
  category: string | null | undefined,
): ProjectCategoryConfig | undefined {
  if (!category) return undefined;
  return PROJECT_CATEGORIES.find(
    (c) =>
      c.id.toLowerCase() === category.toLowerCase() ||
      c.label.toLowerCase() === category.toLowerCase(),
  );
}

export function getProjectCategoryLabel(category: string | null | undefined): string {
  return getProjectCategory(category)?.label ?? category ?? "";
}

export function getProjectCategoryGradient(
  category: string | null | undefined,
): [string, string] {
  return getProjectCategory(category)?.gradient ?? DEFAULT_PROJECT_GRADIENT;
}

export function getProjectCategoryBadgeStyle(category: string | null | undefined): {
  bgBadge: string;
  textColor: string;
  borderColor: string;
} {
  const match = getProjectCategory(category);
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
