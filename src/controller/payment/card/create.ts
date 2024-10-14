import { Request, Response } from 'express'
import { cardValidator } from '../../../utils/formValidator/cardValidator'
import { cardInfoValidator } from '../../../utils/functions/cardValidator'

class CreateCardController {

    async execute(req: Request, res: Response) {
        try {
            const { cvv, expirationDate, number } = await cardValidator.validate(req.body)

            const cInfo = cardInfoValidator(number, cvv, expirationDate)

            if (!cInfo.isValid) {
                return res.status(400).json({ message: cInfo.error })
            }


            return res.status(201).json({ message: "ok" })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { CreateCardController }