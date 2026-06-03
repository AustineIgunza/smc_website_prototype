-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "testimonial" TEXT,
ADD COLUMN     "testimonialAuthor" TEXT;
