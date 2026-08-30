import { z } from "zod";

const text = (min = 1) =>
  z.string().trim().min(min, `Must be at least ${min} characters`);
const longText = z.string().trim().min(1, "Required");

const internalPartnerSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
  name: text(),
  category: z.string().trim().optional(),
});

const externalPartnerSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
  name: text(),
  description: longText,
  industry: z.string().trim().optional(),
  logoUrl: z.string().trim().nullable().optional(),
  websiteUrl: z.string().trim().nullable().optional(),
});

export const partnershipsContentSchema = z.object({
  title: text(2),
  subtitle: text(),
  description: longText,
  internalPartners: z.array(internalPartnerSchema),
  externalPartners: z.array(externalPartnerSchema),
});

export const partnershipsContentUpdateSchema = partnershipsContentSchema.partial();
