import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../environment/index";
import { TokenPayload } from '../../interfaces/'
import { findUserById } from "../../database/repositories/userRepository";


class GetUserController {
    async execute(req: Request, res: Response
    ) {
        try {
            const id = req.userId;

            const user = await findUserById(id)


            return res.status(200).json({ user })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }


    }
}

export { GetUserController }