import { Request, Response } from 'express'
import { cancelRide } from '../../database/repositories/rideRepository'

class CancelRideController {

    async execute(req: Request, res: Response) {
        try {
            const { rideId } = req.params
            const ride = await cancelRide(Number(rideId))

            if (ride.count < 1) {
                throw new Error('Não há corrida')
            }

            return res.status(200).json(ride)
        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export { CancelRideController }