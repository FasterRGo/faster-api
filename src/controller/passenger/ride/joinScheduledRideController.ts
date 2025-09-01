import { Request, Response } from "express";
import { joinScheduledRide } from "../../../database/repositories/rideRepository";
import * as yup from "yup";

const joinScheduledRideSchema = yup.object().shape({
  scheduledRideId: yup
    .string()
    .uuid("ID da corrida agendada inválido")
    .required("ID da corrida agendada é obrigatório"),
});

class JoinScheduledRideController {
  async execute(req: Request, res: Response) {
    try {
      const { scheduledRideId } = await joinScheduledRideSchema.validate(
        req.body
      );
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
