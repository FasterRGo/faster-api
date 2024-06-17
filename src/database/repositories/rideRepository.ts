import { prisma } from "../../service/prisma"
import { IRide } from '../../interfaces/'

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

const cancelRide = async (id: number) => {
    return await prisma.ride.updateMany({
        where: {
            AND: [{
                id
            }, {
                NOT: [{
                    OR: [
                        { status: 'CANCELED' },
                        { status: 'FINISHED' },
                        { status: 'ACCEPTED' },
                        { status: 'INITIALIZED' },
                    ]
                }]
            }]
        }, data: {
            status: 'CANCELED'
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
    createRide,
    cancelRide
}