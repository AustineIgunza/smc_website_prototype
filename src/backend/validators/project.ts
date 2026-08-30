import { z } from "zod";

const commaSeparated = z
  .string()
  .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean));

const optionalUrl = z.string().trim().url().or(z.literal("")).optional();

// Narrative sections are optional: not every project has source material for a
// full problem/approach/outcome write-up. When present, require real copy.
const narrative = z
  .string()
  .trim()
  .min(10)
  .or(z.literal(""))
  .optional()
  .default("");

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(2),
  category: z.string().trim().min(1),
  desc: z.string().trim().min(10),
  problem: narrative,
  approach: narrative,
  outcome: narrative,
  metrics: commaSeparated,
  team: commaSeparated,
  duration: z.string().trim().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
  clientName: z.string().trim().optional(),
  coverImageUrl: optionalUrl,
  liveUrl: optionalUrl,
  tags: commaSeparated.optional().default([]),
  featured: z.boolean().optional().default(false),
  testimonial: z.string().trim().optional(),
  testimonialAuthor: z.string().trim().optional(),
});

export const projectUpdateSchema = projectSchema.partial();
