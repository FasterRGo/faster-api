import { Request, Response } from 'express'
import { deleteCommonPlace, listCommonPlaces } from '../../database/repositories/commonPlacesRepository'

class DeleteCommonPlacesController {

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.body
            const commonPlaces = await deleteCommonPlace(id)

            return res.status(200).json({ commonPlaces })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { DeleteCommonPlacesController }