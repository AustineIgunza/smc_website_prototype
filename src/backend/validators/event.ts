import { z } from "zod";

export const eventSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().trim().min(1, "Category is required"),
  type: z.enum(["FREE", "PAID"]),
  priceKes: z.coerce.number().int().nonnegative("Price must be a non-negative integer").default(0),
  capacity: z.coerce.number().int().positive("Capacity must be a positive integer").nullable().optional(),
  startsAt: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date({ message: "Must be a valid date" })),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).default("DRAFT"),
  ownerType: z.enum(["INTERNAL", "PARTNER"]).default("INTERNAL"),
  partnerId: z.string().trim().nullable().optional(),
  commissionRate: z.coerce.number().nonnegative().default(0.15),
  imageUrl: z.string().url("Must be a valid URL").nullish().or(z.literal("")),
});

export const eventUpdateSchema = eventSchema.partial();
