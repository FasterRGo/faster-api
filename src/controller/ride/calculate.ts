import { Request, Response } from 'express'
import axios from 'axios';
import { calculate } from '../../service/calculateDistance';
import { findUserRideOn } from '../../database/repositories/rideRepository';

class CalculateRideController {
    async execute(req: Request, res: Response) {
        try {
            const { from, to } = req.body

            const userHasRideOn = await findUserRideOn(req.userId)

            if (userHasRideOn) {
                throw new Error('Já há uma corrida em andamento, você não pode calcular outra enquanto não terminar a sua!')
            }

            const route = await calculate({ from, to })

            return res.json({
                distance: `${(route.distance / 1000).toFixed(2)}kM`,
                duration: route.duration,
                price: route.price,
                city: route.city
            });

        } catch (error: any) {
            return res.json({
                message: error.message
            })
        }
    }

}

export { CalculateRideController }