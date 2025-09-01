import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DefaultPaymentMethodSeed() {
    const existingPaymentMethods = await prisma.defaultPaymentMethod.findMany()

    if (existingPaymentMethods.length === 0) {
        await prisma.defaultPaymentMethod.createMany({
            data: [
                {
                    name: 'Dinheiro',
                    status: true,
                },
                {
                    name: 'Pix',
                    status: false,
                },
            ],
        })
        console.log('Métodos de pagamento padrão foram adicionados!')
    } else {
        console.log('Métodos de pagamento padrão já existem.')
    }
}


