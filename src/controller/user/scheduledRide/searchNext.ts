import { Request, Response } from "express";
import * as yup from "yup";
import {
  findNearestScheduledRides,
  findScheduledRidesByCities,
} from "../../../database/repositories/scheduledRideRepository";

const searchNextSchema = yup.object().shape({
  originCity: yup.string().required(),
  destinationCity: yup.string().required(),
  limit: yup.number().optional().min(1).max(100),
});

class SearchNextRideController {
  async execute(req: Request, res: Response) {
    try {
      const { destinationCity, originCity, limit } =
        await searchNextSchema.validate(req.body, { abortEarly: false });

      const rides = await findScheduledRidesByCities({
        destinationCity,
        originCity,
        limit,
        userId: req.userId,
      });

      return res.status(200).json(rides);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
export default SearchNextRideController;
