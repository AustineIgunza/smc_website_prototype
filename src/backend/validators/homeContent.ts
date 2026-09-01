import { z } from "zod";

const text = (min = 1) =>
  z.string().trim().min(min, `Must be at least ${min} characters`);
const longText = z.string().trim().min(1, "Required");
const stat = z.coerce.number().int().min(0, "Must be 0 or more");

export const homeContentSchema = z.object({
  heroEyebrow: text(2),
  heroTitleLine1: text(),
  heroTitleLine2: text(),
  heroTitleAccent: text(),
  heroSubtitle: longText,
  heroPrimaryCtaLabel: text(2),
  heroPrimaryCtaHref: text(),
  heroSecondaryCtaLabel: text(2),
  heroSecondaryCtaHref: text(),

  missionEyebrow: text(2),
  missionTitle: text(),
  missionTitleAccent: text(),
  missionBody: longText,

  visionEyebrow: text(2),
  visionTitle: text(),
  visionTitleAccent: text(),
  visionBody: longText,

  storyEyebrow: text(2),
  storyHeading: text(),
  storyParagraph1: longText,
  storyParagraph2: longText,

  stat1Value: stat,
  stat1Label: text(),
  stat2Value: stat,
  stat2Label: text(),
  stat3Value: stat,
  stat3Label: text(),

  insideEyebrow: z.string().trim().default(""),
  insideTitleStart: z.string().trim().default(""),
  insideTitleAccent: z.string().trim().default(""),
  insideSubtitle: z.string().trim().optional().default(""),
  insideTile1Label: z.string().trim().optional().default(""),
  insideTile2Label: z.string().trim().optional().default(""),
  insideTile3Label: z.string().trim().optional().default(""),
  insideTile4Label: z.string().trim().optional().default(""),
  insideTile1Image: z.string().trim().optional().nullable(),
  insideTile2Image: z.string().trim().optional().nullable(),
  insideTile3Image: z.string().trim().optional().nullable(),
  insideTile4Image: z.string().trim().optional().nullable(),
});

export const homeContentUpdateSchema = homeContentSchema.partial();
