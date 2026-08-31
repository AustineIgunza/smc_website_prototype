import { z } from "zod";

export const pastEventSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().default(""),
  date: z.string().datetime({ message: "Valid ISO date is required" }).optional().default(() => new Date().toISOString()),
  location: z.string().default(""),
  attendanceCount: z.number().int().nonnegative().nullable().optional(),
  coverImageUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  galleryUrls: z.array(z.string().url()).default([]),
  highlights: z.array(z.string()).default([]),
  keyTakeaways: z.array(z.string()).default([]),
  speakers: z.array(z.string()).default([]),
  partnerName: z.string().nullable().optional(),
  testimonial: z.string().nullable().optional(),
  testimonialAuthor: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).default("PUBLISHED"),
});

export type PastEventInput = z.infer<typeof pastEventSchema>;
