import { Request, Response } from 'express'
import { deleteCard } from '../../../database/repositories/cardRepository'
class DeleteCardController {

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.params
            const card = await deleteCard(Number(id), req.userId)

            return res.status(201).json({ message: "Cartão deletado com sucessso", card })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message, hasMessage: false })
        }
    }

}

export { DeleteCardController }