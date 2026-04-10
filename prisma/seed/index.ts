import { DefaultPaymentMethodSeed } from "./defaultPaymentMethods";
import { DefaultUser } from "./user";
import { DefaultDriver } from "./driver";
import { DefaultScheduledRides } from "./scheduledRides";
import { prisma } from "../../src/service/prisma";

async function main() {
  await DefaultPaymentMethodSeed();
  await DefaultUser();
  await DefaultDriver();
  await DefaultScheduledRides();
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
