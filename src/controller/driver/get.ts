import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../environment/index";
import { TokenPayload } from "../../interfaces/";
import { findDriverById } from "../../database/repositories/driverRepository";

class GetDriverController {
  async execute(req: Request, res: Response) {
    try {
      const id = req.userId;

      const driver = await findDriverById(id);

      return res.status(200).json({ driver });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { GetDriverController };
