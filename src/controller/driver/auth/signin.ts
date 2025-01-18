import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { findDriverByEmail } from "../../../database/repositories/driverRepository";
import { env } from "../../../environment";
import { getActiveRide } from "../../../database/repositories/rideRepository";

class DriverSignInController {
  async execute(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const driver = await findDriverByEmail({
        email: email as string,
        include: {
          car: true,
        },
      });
      const { AUTH_TOKEN, REFRESH_TOKEN } = env;

      if (!driver) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await compare(
        password as string,
        driver.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const id = driver.id;
      const driverEmail = driver.email;

      const token = sign({ id, email: driverEmail }, AUTH_TOKEN as string, {
        expiresIn: "1h",
      });

      const refreshT = sign(
        { id, email: driverEmail },
        REFRESH_TOKEN as string,
        {
          expiresIn: "10h",
        }
      );

      const ride = await getActiveRide({ driverId: driver.id });

      return res
        .status(200)
        .json({
          driver,
          accessToken: token,
          refreshToken: refreshT,
          activeRide: ride,
        });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}

export { DriverSignInController };
