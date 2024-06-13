/*
  Warnings:

  - Added the required column `finalLatitudeLoction` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalLongitudeLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialLatitudeLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialLongitudeLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "finalLatitudeLoction" TEXT NOT NULL,
ADD COLUMN     "finalLongitudeLocation" TEXT NOT NULL,
ADD COLUMN     "initialLatitudeLocation" TEXT NOT NULL,
ADD COLUMN     "initialLongitudeLocation" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CommonPlaces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommonPlaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteDriver" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteDriver_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommonPlaces" ADD CONSTRAINT "CommonPlaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDriver" ADD CONSTRAINT "FavoriteDriver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDriver" ADD CONSTRAINT "FavoriteDriver_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
