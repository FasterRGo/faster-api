import { Request, Response } from 'express'
import { cardValidator } from '../../../utils/formValidator/cardValidator'
import { cardInfoValidator } from '../../../utils/functions/cardValidator'
import { createCardMethod } from '../../../database/repositories/cardRepository'
import bcrypt from 'bcryptjs'
class CreateCardController {

    async execute(req: Request, res: Response) {
        try {
            const { cvv, expirationDate, number, type } = await cardValidator.validate(req.body)

            const cInfo = cardInfoValidator(number, cvv, expirationDate)

            if (!cInfo.isValid) {
                return res.status(400).json({ message: cInfo.error, hasMessage: true })
            }
            const hashedCardCVV = await bcrypt.hash(cvv, 12)

            const card = await createCardMethod(number, hashedCardCVV, type, cInfo.flag as string, expirationDate, req.userId)

            return res.status(201).json({ message: "Cartão cadastrado com sucessso", card })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message, hasMessage: false })
        }
    }

}

export { CreateCardController }