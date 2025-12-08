import { prisma } from "../../service/prisma"
import { IUser } from '../../interfaces/'
import { User } from "@prisma/client"

type UserWith = Omit<User, 'password' | 'createdAt'>

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

const editUser = async (userToBeUpdated: UserWith) => {
    const { user } = prisma
    return await user.update({ where: { id: userToBeUpdated.id }, data: userToBeUpdated })
}

const createUser = async (userToBeIN: IUser) => {
    return await prisma.user.create({ data: userToBeIN })
}

const updateUserPhoto = async (userId: number, photoPath: string) => {
    const { user } = prisma
    return await user.update({
        where: { id: userId },
        data: { photo: photoPath }
    })
}

export { findUserByEmail, findUserById, createUser, editUser, updateUserPhoto }