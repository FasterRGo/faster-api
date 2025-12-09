import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../../../service/prisma'
import { signUpValidator } from '../../../utils/formValidator/userValidator'
import { createUser, findUserByEmail } from '../../../database/repositories/userRepository'
import { ValidationError } from 'yup'

class UserSignUpController {

    async execute(req: Request, res: Response) {

        try {
            const { email, password, name, phoneNumber } = await signUpValidator.validate(req.body)
            const emailAlreadyExists = await findUserByEmail(email)

            if (emailAlreadyExists) {
                return res.status(409).json({ 
                    message: 'Este email já está cadastrado em nossa plataforma',
                    error: 'EMAIL_ALREADY_EXISTS',
                    field: 'email',
                    details: 'Tente fazer login ou use outro endereço de email'
                })
            }

            const hashPassword = await hash(password, 8)

            const user = await createUser({ email, name, password: hashPassword, phoneNumber })

            return res.status(201).json({
                message: 'Cadastro realizado com sucesso!',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            })

        }
        catch (err: any) {
            // Erro de validação do Yup
            if (err instanceof ValidationError) {
                const errors = err.inner.map((error: any) => ({
                    field: error.path,
                    message: error.message
                }))
                
                return res.status(400).json({
                    message: 'Dados inválidos. Verifique os campos abaixo',
                    error: 'VALIDATION_ERROR',
                    errors: errors,
                    details: errors.map((e: any) => e.message).join(', ')
                })
            }

            // Erro de telefone duplicado (se houver constraint no banco)
            if (err.code === 'P2002') {
                const field = err.meta?.target?.[0] || 'campo'
                return res.status(409).json({
                    message: `Este ${field === 'phoneNumber' ? 'telefone' : field} já está cadastrado`,
                    error: 'DUPLICATE_ENTRY',
                    field: field,
                    details: 'Tente usar outro valor ou faça login'
                })
            }

            // Erro genérico
            return res.status(400).json({
                message: err.message || 'Erro ao processar cadastro',
                error: 'REGISTRATION_ERROR',
                details: 'Tente novamente mais tarde ou entre em contato com o suporte'
            })
        }


    }

}

export { UserSignUpController }