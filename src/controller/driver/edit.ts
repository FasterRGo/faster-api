import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../environment/index";
import { TokenPayload } from "../../interfaces/";
import {
  editDriver,
  findDriverById,
} from "../../database/repositories/driverRepository";
import { Driver } from "@prisma/client";

type DriverWithoutPasswordAndCreatedAt = Omit<Driver, "password" | "createdAt">;

class EditDriverController {
  async execute(req: Request, res: Response) {
    try {
      const updatedDriver = req.body as DriverWithoutPasswordAndCreatedAt;

      updatedDriver.id = req.userId;

      const driver = await editDriver(updatedDriver);

      return res.status(200).json({ driver });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { EditDriverController };
