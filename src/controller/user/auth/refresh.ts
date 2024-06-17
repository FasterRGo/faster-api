import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../../environment/index";
import { TokenPayload } from '../../../interfaces/'


class UserRefreshController {
    async execute(req: Request, res: Response
    ) {
        const { REFRESH_TOKEN, AUTH_TOKEN } = env
        try {
            const { refreshToken } = req.query
            const isValid = verify(refreshToken as string, REFRESH_TOKEN as string);

            if (!isValid) {
                return res.status(300).json({ auth: false, token: '' })
            }

            const { id } = isValid as TokenPayload;
            const newToken = sign({ id }, AUTH_TOKEN as string, { expiresIn: 3600 });

            return res.status(200).json({ auth: true, accessToken: newToken })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }


    }
}

export { UserRefreshController }