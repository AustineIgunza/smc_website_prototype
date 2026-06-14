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

  insideEyebrow: text(2),
  insideTitleStart: text(),
  insideTitleAccent: text(),
  insideSubtitle: longText,
  insideTile1Label: text(),
  insideTile2Label: text(),
  insideTile3Label: text(),
  insideTile4Label: text(),
});

export const homeContentUpdateSchema = homeContentSchema.partial();
