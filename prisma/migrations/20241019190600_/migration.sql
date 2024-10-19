/*
  Warnings:

  - Added the required column `flag` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "flag" TEXT NOT NULL;
