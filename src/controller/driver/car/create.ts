import { Request, Response } from "express";
import { Car } from "@prisma/client";
import {
  createCars,
  listCars,
} from "../../../database/repositories/carRepository";
import { carValidator } from "../../../utils/formValidator/carValidator";

class CreateCarsController {
  async execute(req: Request, res: Response) {
    try {
      const { brand, chassi, model, year, plate } = await carValidator.validate(
        req.body
      );
      const cars = await createCars({
        driverId: req.userId,
        brand,
        chassi,
        model,
        year,
        plate,
      });

      return res.status(201).json({ cars });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { CreateCarsController };
