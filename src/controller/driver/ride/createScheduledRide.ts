import { Request, Response } from "express";
import { hash } from "bcryptjs";
import {
  createRide,
  createScheduledRide,
  findUserRideOn,
} from "../../../database/repositories/rideRepository";
import { calculate, getCityName } from "../../../service/rideInfo";
import { scheduleRideValidator } from "../../../utils/formValidator/rideScheduleValidator";

class CreateScheduledRideController {
  async execute(req: Request, res: Response) {
    try {
      const { from, to, scheduledDate, maxPassengers } =
        await scheduleRideValidator.validate(req.body);
      const { userId } = req;
      const userHasRideOn = await findUserRideOn(userId);

      if (userHasRideOn) {
        throw new Error("Já há uma corrida em andamento");
      }

      const { price } = await calculate({
        from,
        to,
      });

      const { city: originCity, label: originLabel } = await getCityName(
        from.latitude,
        from.longitude
      );
      const { city: destinationCity, label: destinationLabel } =
        await getCityName(to.latitude, to.longitude);

      const ride = await createScheduledRide({
        finalLatitudeLocation: to.latitude,
        finalLongitudeLocation: to.longitude,
        initialLatitudeLocation: from.latitude,
        initialLongitudeLocation: from.longitude,
        destinationLabel,
        originLabel,
        price,
        driverId: userId,
        destinationCity,
        originCity,
        scheduledDate,
        maxPassengers,
      });

      return res.status(201).json(ride);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { CreateScheduledRideController };
