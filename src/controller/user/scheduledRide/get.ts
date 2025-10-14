import { getAllRides } from "../../../database/repositories/scheduledRideRepository";
import { Response } from "express";

class GetScheduledRideController {
  async execute(res: Response) {
    const rides = await getAllRides();
    return res.send(rides);
  }
}

export default GetScheduledRideController;
