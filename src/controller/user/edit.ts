import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../environment/index";
import { TokenPayload } from '../../interfaces/'
import { editUser, findUserById } from "../../database/repositories/userRepository";
import { User } from "@prisma/client";

type UserWithoutPasswordAndCreatedAt = Omit<User, 'password' | 'createdAt'>;

class EditUserController {
    async execute(req: Request, res: Response
    ) {
        try {
            const updatedUser = req.body as UserWithoutPasswordAndCreatedAt

            updatedUser.id = req.userId

            const user = await editUser(updatedUser)

            return res.status(200).json({ user })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }
}

export { EditUserController }