import { Request, Response } from 'express'
import { createCommonPlaces, listCommonPlaces } from '../../database/repositories/commonPlacesRepository'
import { commonPlacesValidator } from '../../utils/formValidator/commonPlacesValidator'
import { CommonPlaces } from '@prisma/client'

class CreateCommonPlacesController {

    async execute(req: Request, res: Response) {
        try {
            const { name, icon, latitude, longitude } = await commonPlacesValidator.validate(req.body)
            const commonPlaces = await createCommonPlaces({
                userId: req.userId,
                latitude,
                longitude,
                name,
                icon
            })

            return res.status(201).json({ commonPlaces })
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { CreateCommonPlacesController }