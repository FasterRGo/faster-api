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
import { cancelDriverRide } from "../../../database/repositories/rideRepository";

class CancelDriverRideController {
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

      const rideUpdated = await cancelDriverRide(req.userId, ride.id);
      return res.status(200).json({ ride: rideUpdated, status: "ACCEPTED" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { CancelDriverRideController };
