import { prisma } from "../../service/prisma"
import { PaymentMethod } from "@prisma/client"


type ICommonPlaces = Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>

const listCommonPlaces = async (id: number) => {
    return await prisma.commonPlaces.findMany({
        where: {
            userId: id
        }, select: {
            latitude: true,
            longitude: true,
            id: true,
            name: true,
            icon: true
        }
    })
}

const createCommonPlaces = async (commonPLace: ICommonPlaces) => {
    return await prisma.commonPlaces.create({
        data: commonPLace
    })
}

const deleteCommonPlace = async (id: number) => {
    return await prisma.commonPlaces.delete({
        where: {
            id
        }
    })
}

export {
    listCommonPlaces,
    createCommonPlaces,
    deleteCommonPlace
}