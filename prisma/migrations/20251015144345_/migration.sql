/*
  Warnings:

  - Added the required column `numberOfSeatsBought` to the `ScheduledRidePassenger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledRidePassenger" ADD COLUMN     "numberOfSeatsBought" INTEGER NOT NULL;
