import { prisma } from "../../service/prisma"
import { IUser } from '../../interfaces/'

const findUserByEmail = async (email: string) => {
    const { user } = prisma
    return await user.findUnique({
        where: {
            email
        }
    })

}

const findUserById = async (id: number) => {
    const { user } = prisma
    return await user.findUnique({
        where: {
            id
        }
    })

}

const createUser = async (userToBeIN: IUser) => {
    const { user } = prisma
    return await user.create({ data: userToBeIN })
}




export { findUserByEmail, findUserById, createUser }