import { prisma } from "../../service/prisma"
import { PaymentMethod } from "@prisma/client"


type ICommonPlaces = Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>

const createCardMethod = async (number: string, cvv: string, type: string, expirationDate: string, userId: number) => {
    return await prisma.paymentMethod.create({
        data: {
            number,
            cvv,
            expirationDate,
            type,
            userId
        }
    })
}



export {
    createCardMethod,

}