import { Request, Response } from "express";
import { cancelRide } from "../../database/repositories/rideRepository";
import { prisma } from "../../service/prisma";

class CancelRideController {
  async execute(req: Request, res: Response) {
    try {
      const { rideId } = req.params;

      const ride = await prisma.ride.findUnique({
        where: {
          id: rideId as string,
        },
      });

      if (!ride) {
        return res.status(404).json({ message: "Corrida não encontrada" });
      }

      if (ride.status === "FINISHED") {
        return res.status(400).json({
          message: "Não é possível cancelar uma corrida que já foi finalizada.",
        });
      }

      const rideCanceled = await cancelRide(rideId as string);

      if (!rideCanceled) {
        throw new Error("Não há corrida");
      }

      return res.status(200).json(rideCanceled);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { CancelRideController };
