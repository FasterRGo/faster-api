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
        return res.status(400).json({
          message: "Email e senha são obrigatórios",
          error: "MISSING_CREDENTIALS",
          details: "Por favor, preencha todos os campos",
        });
      }

      const user = await findUserByEmail(email as string);
      const { AUTH_TOKEN, REFRESH_TOKEN } = env;

      if (!user) {
        return res.status(401).json({
          message: "Email ou senha incorretos",
          error: "INVALID_CREDENTIALS",
          details: "Verifique suas credenciais e tente novamente",
        });
      }

      const isPasswordValid = await compare(password as string, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Email ou senha incorretos",
          error: "INVALID_CREDENTIALS",
          details: "Verifique suas credenciais e tente novamente",
        });
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
      return res.status(500).json({
        message: "Erro ao processar login",
        error: "LOGIN_ERROR",
        details: "Tente novamente mais tarde ou entre em contato com o suporte",
      });
    }
  }
}

export { UserSignInController };
