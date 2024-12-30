-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('IN_USE', 'REVOKED', 'PENDING', 'PASSANGER', 'DRIVER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roomId" INTEGER;

-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "status" "InviteStatus" NOT NULL,
    "roomId" INTEGER
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_id_key" ON "Invite"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "Room"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_id_fkey" FOREIGN KEY ("id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
