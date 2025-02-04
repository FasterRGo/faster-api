-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "isWorking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "socketId" TEXT;
