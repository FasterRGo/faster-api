import { Request, Response } from "express";
import { findUserRideOn } from "../../database/repositories/rideRepository";
import { prisma } from "../../service/prisma";

class ListRideController {
  async execute(req: Request, res: Response) {
    try {
      const rides = await prisma.ride.findMany({
        where: { userId: req.userId },
        include: {
          Driver: true,
          Rate: { where: { commentedBy: "PASSENGER" } },
        },
      });

      return res.status(200).json(rides);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { ListRideController };
