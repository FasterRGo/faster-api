import { prisma } from "../../service/prisma"
import { PaymentMethod } from "@prisma/client"


type ICommonPlaces = Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>

const createCardMethod = async (number: string, cvv: string, type: string, flag: string, expirationDate: string, userId: number) => {
    return await prisma.paymentMethod.create({
        data: {
            number,
            cvv,
            expirationDate,
            type,
            flag,
            userId
        }
    })
}


const listCards = async (id: number) => {
    return await prisma.paymentMethod.findMany({
        where: {
            userId: id
        }, select: {
            number: true,
            expirationDate: true,
            type: true,
            flag: true
        }
    })
}

const deleteCard = async (id: number, userId: number) => {
    return await prisma.paymentMethod.delete({ where: { id, userId }, select: { number: true, expirationDate: true, flag: true, type: true } })
}


export {
    createCardMethod,
    listCards,
    deleteCard
}