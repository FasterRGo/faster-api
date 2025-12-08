import { Request, Response } from "express";
import { prisma } from "../../../service/prisma";
import { finishRide } from "../../../database/repositories/rideRepository";
import { io } from "../../../index";

class FinishRideController {
  async execute(req: Request, res: Response) {
    try {
      const { rideId } = req.params;

      const ride = await prisma.ride.findUnique({
        where: {
          id: rideId,
        },
      });

      if (!ride) {
        return res.status(404).json({ message: "Corrida não encontrada" });
      }

      if (ride.status !== "ACCEPTED") {
        return res.status(400).json({
          message: "Corrida não foi aceita ou foi finalizada.",
        });
      }

      const rideUpdated = await finishRide(ride.id, io);
      return res.status(200).json({ ride: rideUpdated, status: "FINISHED" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { FinishRideController };
