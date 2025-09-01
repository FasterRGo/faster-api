import { Request, Response } from "express";
import { joinScheduledRide } from "../../../database/repositories/rideRepository";
import { z } from "zod";

const joinScheduledRideSchema = z.object({
  scheduledRideId: z.string().uuid(),
});

class JoinScheduledRideController {
  async execute(req: Request, res: Response) {
    try {
      const { scheduledRideId } = joinScheduledRideSchema.parse(req.body);
      const { userId } = req;

      if (!userId) {
        throw new Error("User ID is required.");
      }

      const scheduledRidePassenger = await joinScheduledRide(
        scheduledRideId,
        userId
      );

      return res.status(201).json(scheduledRidePassenger);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { JoinScheduledRideController };
