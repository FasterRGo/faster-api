-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "scheduledRideId" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "scheduledRideId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "scheduledRideId" TEXT;

-- CreateTable
CREATE TABLE "ScheduledRide" (
    "id" TEXT NOT NULL,
    "driverId" INTEGER NOT NULL,
    "initialLatitudeLocation" DOUBLE PRECISION NOT NULL,
    "initialLongitudeLocation" DOUBLE PRECISION NOT NULL,
    "finalLatitudeLocation" DOUBLE PRECISION NOT NULL,
    "finalLongitudeLocation" DOUBLE PRECISION NOT NULL,
    "originCity" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "scheduledDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ScheduledRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledRidePassenger" (
    "id" TEXT NOT NULL,
    "scheduledRideId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ScheduledRidePassenger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledRidePassenger_scheduledRideId_userId_key" ON "ScheduledRidePassenger"("scheduledRideId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_scheduledRideId_fkey" FOREIGN KEY ("scheduledRideId") REFERENCES "ScheduledRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_scheduledRideId_fkey" FOREIGN KEY ("scheduledRideId") REFERENCES "ScheduledRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledRide" ADD CONSTRAINT "ScheduledRide_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledRidePassenger" ADD CONSTRAINT "ScheduledRidePassenger_scheduledRideId_fkey" FOREIGN KEY ("scheduledRideId") REFERENCES "ScheduledRide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledRidePassenger" ADD CONSTRAINT "ScheduledRidePassenger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_scheduledRideId_fkey" FOREIGN KEY ("scheduledRideId") REFERENCES "ScheduledRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
