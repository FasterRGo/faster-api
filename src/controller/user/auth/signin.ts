import { compare } from "bcryptjs";
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { findUserByEmail } from "../../../database/repositories/userRepository";
import { signInValidator } from "../../../utils/formValidator/userValidator";
import { env } from "../../../environment";

class UserSignInController {
    async execute(req: Request, res: Response) {
        try {
            const { email, password } = await signInValidator.validate(req.body)
            const user = await findUserByEmail(email)
            const { AUTH_TOKEN } = env

            if (!user) {
                throw new Error('Email ou Senha inválidos')
            }

            const isPasswordValid = await compare(password, user.password)

            if (!isPasswordValid) {
                throw new Error('Email ou Senha inválidos')
            }

            const id = user.id;


            const token = sign({ id }, AUTH_TOKEN as string, {
                expiresIn: 3600
            })

            const refreshT = sign({ id }, AUTH_TOKEN as string, {
                expiresIn: 36000
            })



            return res.status(200).json({ user, accessToken: token, refreshToken: refreshT })

        } catch (error: any) {
            return res.status(400).json({
                message: error.message
            })
        }



    }
}

export { UserSignInController }