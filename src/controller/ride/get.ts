import { Request, Response } from 'express'
import { findUserRideOn } from '../../database/repositories/rideRepository'

class GetRideController {

    async execute(req: Request, res: Response) {
        try {
            const { rideId } = req.params
            const ride = await findUserRideOn(Number(rideId))

            if (!ride) {
                throw new Error('Não há corrida')
            }
            return res.status(200).json(ride)
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { GetRideController }