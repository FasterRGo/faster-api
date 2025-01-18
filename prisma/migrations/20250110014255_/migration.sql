-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_rideId_fkey";

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
