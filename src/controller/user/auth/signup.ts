import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../../../service/prisma'
import { signUpValidator } from '../../../utils/formValidator/userValidator'
import { createUser, findUserByEmail } from '../../../database/repositories/userRepository'

class UserSignUpController {

    async execute(req: Request, res: Response) {

        try {
            const { email, password, name, phoneNumber } = await signUpValidator.validate(req.body)
            const emailAlreadyExists = await findUserByEmail(email)

            if (emailAlreadyExists) {
                throw new Error('Email já cadastrado')
            }

            const hashPassword = await hash(password, 8)

            const user = await createUser({ email, name, password: hashPassword, phoneNumber })

            return res.status(201).json(user)

        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }


    }

}

export { UserSignUpController }