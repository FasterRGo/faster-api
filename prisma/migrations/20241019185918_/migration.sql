/*
  Warnings:

  - A unique constraint covering the columns `[userId,number]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_userId_number_key" ON "PaymentMethod"("userId", "number");
