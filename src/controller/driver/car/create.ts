import { Request, Response } from "express";
import { createCar, listCars } from "../../database/repositories/cars";
import { carsValidator } from "../../utils/formValidator/carsValidator";
import { Cars } from "@prisma/client";

class CreateCarsController {
  async execute(req: Request, res: Response) {
    try {
      const { name, icon, latitude, longitude } = await carsValidator.validate(
        req.body
      );
      const cars = await createCars({
        userId: req.userId,
        latitude,
        longitude,
        name,
        icon,
      });

      return res.status(201).json({ cars });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { CreateCarsController };
