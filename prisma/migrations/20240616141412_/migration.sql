/*
  Warnings:

  - You are about to drop the column `finalLatitudeLoction` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `finalLatitudeLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `finalLongitudeLocation` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `initialLatitudeLocation` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `initialLongitudeLocation` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "finalLatitudeLoction",
DROP COLUMN "password",
ADD COLUMN     "finalLatitudeLocation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
DROP COLUMN "finalLongitudeLocation",
ADD COLUMN     "finalLongitudeLocation" DOUBLE PRECISION NOT NULL,
DROP COLUMN "initialLatitudeLocation",
ADD COLUMN     "initialLatitudeLocation" DOUBLE PRECISION NOT NULL,
DROP COLUMN "initialLongitudeLocation",
ADD COLUMN     "initialLongitudeLocation" DOUBLE PRECISION NOT NULL;
