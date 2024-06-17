import { prisma } from "../../service/prisma"
import { IUser, IRide } from '../../interfaces/'

const findUserRideOn = async (id: number) => {
    return await prisma.ride.findFirst({
        where: {
            AND: [{
                userId: id
            }, {
                NOT: [{
                    OR: [
                        { status: 'CANCELED' },
                        { status: 'FINISHED' }
                    ]
                }]
            }]
        }
    })
}

const createRide = async (rideToBeIn: IRide) => {
    return await prisma.ride.create({
        data: rideToBeIn
    })
}


export {
    findUserRideOn,
    createRide
}