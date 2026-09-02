-- Drop the eyebrow/title/subtitle columns for the "Inside the Agency" section.
-- The 4 tile labels stay; only the heading block was removed.
ALTER TABLE "HomeContent"
  DROP COLUMN "insideEyebrow",
  DROP COLUMN "insideTitleStart",
  DROP COLUMN "insideTitleAccent",
  DROP COLUMN "insideSubtitle";
