import { Request, Response } from 'express'
import { listCards } from '../../../database/repositories/cardRepository'
import { listDefaultPaymentMethods } from '../../../database/repositories/defaultPaymentMethodsRepository'
class GetCardController {
    async execute(req: Request, res: Response) {
        try {
            const cards = await listCards(req.userId)
            const defaultPaymentMethods = await listDefaultPaymentMethods()
            return res.status(200).json({ message: "Pagamentos listados com sucesso", cards, defaultPaymentMethods })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message, hasMessage: false })
        }
    }

}

export { GetCardController }