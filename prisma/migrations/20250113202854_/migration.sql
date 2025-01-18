/*
  Warnings:

  - The primary key for the `Ride` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rideId` on the `Room` table. All the data in the column will be lost.
  - Made the column `roomId` on table `Invite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_rideId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_rideId_fkey";

-- DropIndex
DROP INDEX "Room_rideId_key";

-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "roomId" SET NOT NULL,
ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Rate" ALTER COLUMN "rideId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ride_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ride_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "rideId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
