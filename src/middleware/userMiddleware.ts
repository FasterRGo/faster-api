import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../environment/";
import { TokenPayload } from "../interfaces";
import { findUserById } from "../database/repositories/userRepository";

async function userMiddleWare(req: Request, res: Response, next: NextFunction) {
  const { AUTH_TOKEN } = env;
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("Token não encontrado");
    }
    const [, token] = authorization.split(" ");

    if (!token) {
      throw new Error("Token não encontrado");
    }
    try {
      const data = verify(token, AUTH_TOKEN as string) as TokenPayload;
      const user = await findUserById(data.id);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      req.userId = user.id;
      return next();
    } catch (error) {
      throw new Error("Token inválido");
    }
  } catch (error: any) {
    return res.status(401).json(error.message);
  }
}

export { userMiddleWare };
