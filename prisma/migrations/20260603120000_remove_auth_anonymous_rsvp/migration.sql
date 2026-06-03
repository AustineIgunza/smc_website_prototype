-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropIndex
DROP INDEX "Registration_userId_eventId_key";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "userId",
ADD COLUMN     "guestEmail" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "guestPhone" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Registration_eventId_guestEmail_key" ON "Registration"("eventId", "guestEmail");
