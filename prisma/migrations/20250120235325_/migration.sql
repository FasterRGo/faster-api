-- CreateEnum
CREATE TYPE "Creation" AS ENUM ('DRIVER', 'PASSENGER', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_roomId_fkey";

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "createdBy" "Creation" NOT NULL DEFAULT 'SYSTEM',
ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
