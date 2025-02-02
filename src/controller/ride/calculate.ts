import { Request, Response } from "express";
import { calculate } from "../../service/calculateDistance";
import { findUserRideOn } from "../../database/repositories/rideRepository";

class CalculateRideController {
  async execute(req: Request, res: Response) {
    try {
      const { from, to } = req.body;

      const userHasRideOn = await findUserRideOn(req.userId);

      if (userHasRideOn) {
        throw new Error(
          "Já há uma corrida em andamento, você não pode calcular outra enquanto não terminar a sua!"
        );
      }

      const route = await calculate({ from, to });

      return res.json({
        distance_string: `${(route.distance / 1000).toFixed(2)}kM`,
        distance: route.distance / 1000,
        duration: route.duration,
        total_price: route.price,
        driver_price: Number((route.price * 0.8).toFixed(2)),
        faster_prie: Number((route.price * 0.2).toFixed(2)),
        city: route.city,
      });
    } catch (error: any) {
      return res.status(error?.response?.status | error.status | 400).json({
        message: error.message,
        // detail: error.response.data,
      });
    }
  }
}

export { CalculateRideController };
