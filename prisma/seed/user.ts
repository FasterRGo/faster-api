import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function DefaultUser() {
  const user = await prisma.user.findFirst({
    where: { email: "gstsilva.async@gmail.com" },
  });

  const password = await hash("Ab123456@", 8);

  if (!user) {
    await prisma.user.create({
      data: {
        email: "gstsilva.async@gmail.com",
        password,
        name: "Gustavo teste",
        phoneNumber: "11123412343",
      },
    });
    console.log("Usuário adicionado com sucesso");
  } else {
    console.log("Usuário padrão já existe");
  }
}
