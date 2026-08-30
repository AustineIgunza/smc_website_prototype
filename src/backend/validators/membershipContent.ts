import { z } from "zod";

const text = (min = 1) =>
  z.string().trim().min(min, `Must be at least ${min} characters`);
const longText = z.string().trim().min(1, "Required");

const benefitSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  title: text(),
  desc: text(),
  longDesc: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const joinStepSchema = z.object({
  num: z.string().trim().min(1, "Step number is required"),
  title: text(),
  desc: text(),
  screenshotUrl: z.string().trim().nullable().optional(),
});

export const membershipContentSchema = z.object({
  title: text(2),
  subtitle: text(),
  description: longText,
  joinTitle: text(),
  joinDescription: longText,
  joinCtaLabel: text(),
  joinCtaHref: text(),
  benefits: z.array(benefitSchema),
  joinSteps: z.array(joinStepSchema),
});

export const membershipContentUpdateSchema = membershipContentSchema.partial();
