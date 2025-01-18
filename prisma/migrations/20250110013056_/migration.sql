/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CommentedBy" AS ENUM ('DRIVER', 'PASSENGER');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "Rate" (
    "id" SERIAL NOT NULL,
    "rideId" INTEGER NOT NULL,
    "rate" INTEGER,
    "description" TEXT,
    "commentedBy" "CommentedBy" NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
