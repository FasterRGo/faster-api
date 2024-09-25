import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { createRide, findUserRideOn } from '../../database/repositories/rideRepository'
import { rideValidator } from '../../utils/formValidator/rideValidator'
import { calculate } from '../../service/calculateDistance'

class CreateRideController {

    async execute(req: Request, res: Response) {

        try {
            const { from, to } = await rideValidator.validate(req.body)
            const { userId } = req
            const userHasRideOn = await findUserRideOn(userId)

            if (userHasRideOn) {
                throw new Error('Já há uma corrida em andamento')
            }

            const { price } = await calculate({
                from, to
            })


            const ride = await createRide({
                finalLatitudeLocation: to.latitude,
                finalLongitudeLocation: to.longitude,
                initialLatitudeLocation: from.latitude,
                initialLongitudeLocation: from.longitude,
                price,
                userId
            })

            return res.status(201).json(ride)

        }
        catch (err: any) {
            return res.status(400).json({ message: err.message })
        }


    }

}

export { CreateRideController }