/*
  Warnings:

  - Added the required column `icon` to the `CommonPlaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommonPlaces" ADD COLUMN     "icon" TEXT NOT NULL;
