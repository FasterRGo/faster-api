import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { findUserByEmail } from "../../../database/repositories/userRepository";
import { env } from "../../../environment";
import { getActiveRide } from "../../../database/repositories/rideRepository";

class UserSignInController {
  async execute(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      console.log(email, password);

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await findUserByEmail(email as string);
      const { AUTH_TOKEN, REFRESH_TOKEN } = env;

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await compare(password as string, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const id = user.id;

      const token = sign({ id }, AUTH_TOKEN as string, {
        expiresIn: "1h",
      });

      const refreshT = sign({ id }, REFRESH_TOKEN as string, {
        expiresIn: "10h",
      });

      const activeRide = await getActiveRide({ userId: id });

      return res
        .status(200)
        .json({ user, accessToken: token, refreshToken: refreshT, activeRide });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}

export { UserSignInController };
