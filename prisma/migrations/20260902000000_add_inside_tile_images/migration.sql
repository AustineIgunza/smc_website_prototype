-- Add nullable image URL columns for the 4 "Inside the Agency" homepage tiles.
-- Idempotent with IF NOT EXISTS: the columns already exist on some environments
-- where they were added out-of-band, so this migration is safe to (re-)apply.
ALTER TABLE "HomeContent"
  ADD COLUMN IF NOT EXISTS "insideTile1Image" TEXT,
  ADD COLUMN IF NOT EXISTS "insideTile2Image" TEXT,
  ADD COLUMN IF NOT EXISTS "insideTile3Image" TEXT,
  ADD COLUMN IF NOT EXISTS "insideTile4Image" TEXT;
