/*
  Warnings:

  - You are about to drop the column `status` on the `PaymentMethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "status";

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_number_key" ON "PaymentMethod"("number");
