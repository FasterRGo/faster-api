/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ride_roomId_key" ON "Ride"("roomId");
