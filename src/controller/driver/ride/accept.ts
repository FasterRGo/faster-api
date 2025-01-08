import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../../environment/index";
import { TokenPayload } from "../../../interfaces/";
import {
  editDriver,
  findDriverById,
} from "../../../database/repositories/driverRepository";
import { Driver } from "@prisma/client";
import { prisma } from "../../../service/prisma";
import { acceptRide } from "../../../database/repositories/rideRepository";

type DriverWithoutPasswordAndCreatedAt = Omit<Driver, "password" | "createdAt">;

class AcceptRideController {
  async execute(req: Request, res: Response) {
    try {
      const { rideId } = req.params;

      const ride = await prisma.ride.findUnique({
        where: {
          id: Number(rideId),
        },
      });

      if (!ride) {
        return res.status(404);
      }

      if (ride.status !== "REQUESTED") {
        return res.status(400).json({
          message:
            "Corrida já foi aceita, está em andamento ou foi finalizada.",
        });
      }

      const rideUpdated = await acceptRide(req.userId, ride.id);
      return res.status(200).json({ ride: rideUpdated, status: "ACCEPTED" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { AcceptRideController };
