import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function DefaultDriver() {
  const user = await prisma.driver.findFirst({
    where: { email: "gstsilva.async@gmail.com" },
  });

  const password = await hash("Ab123456@", 8);

  if (!user) {
    await prisma.driver.create({
      data: {
        email: "gstsilva.async@gmail.com",
        password,
        name: "Gustavo teste",
        phoneNumber: "11123412343",
      },
    });
    console.log("Motorista adicionado com sucesso");
  } else {
    console.log("Motorista padrão já existe");
  }
}
