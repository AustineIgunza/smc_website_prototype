import { z } from "zod";

const commaSeparated = z
  .string()
  .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean));

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  role: z.string().trim().min(2, "Role must be at least 2 characters"),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  course: z.string().trim().min(2, "Course must be at least 2 characters"),
  year: z.string().trim().min(1, "Year is required"),
  bio: z.string().trim().optional().default(""),
  focus: z
    .union([
      commaSeparated,
      z.array(z.string()),
    ])
    .optional()
    .default([]),
  quote: z.string().trim().optional().default(""),
  socials: z
    .array(
      z.object({
        platform: z.string().trim().min(1),
        handle: z.string().trim().min(1),
      })
    )
    .optional()
    .default([]),
  avatarGradient: z.array(z.string().trim()).length(2, "Avatar gradient must have exactly 2 colors"),
  // Accept absolute URLs (Supabase Storage), relative paths served from /public
  // (e.g. "/team/devyan-jethwa.jpg"), empty string, null, or undefined.
  avatarUrl: z
    .union([
      z.string().url("Must be a valid URL"),
      z.string().regex(/^\/[\w.\-\/]+$/, "Must be a valid absolute path (starting with /)"),
      z.literal(""),
    ])
    .nullish(),
});

export const teamMemberUpdateSchema = teamMemberSchema.partial();
