/*
  Warnings:

  - Added the required column `chassi` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "chassi" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;
