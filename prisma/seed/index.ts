import { DefaultPaymentMethodSeed } from "./defaultPaymentMethods";
import { DefaultUser } from "./user";
import { DefaultDriver } from "./driver";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await DefaultPaymentMethodSeed();
  await DefaultUser();
  await DefaultDriver();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
