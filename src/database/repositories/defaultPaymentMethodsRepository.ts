import { prisma } from "../../service/prisma";

const listDefaultPaymentMethods = async () => {
  return await prisma.defaultPaymentMethod.findMany({
    select: {
      name: true,
      status: true,
    },
  });
};

export { listDefaultPaymentMethods };
