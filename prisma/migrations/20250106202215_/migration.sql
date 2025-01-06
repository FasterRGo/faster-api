/*
  Warnings:

  - Made the column `roomId` on table `Invite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_roomId_fkey";

-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "roomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
