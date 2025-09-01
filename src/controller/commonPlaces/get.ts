import { Request, Response } from 'express'
import { listCommonPlaces } from '../../database/repositories/commonPlacesRepository'

class GetCommonPlacesController {

    async execute(req: Request, res: Response) {
        try {
            const id = req.userId
            const commonPlaces = await listCommonPlaces(id)

            return res.status(200).json({ commonPlaces })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { GetCommonPlacesController }