import { prisma } from "../../service/prisma";
import { IDriver } from "../../interfaces/";
import { Driver } from "@prisma/client";

type DriverWith = Omit<Driver, "password" | "createdAt">;

const findDriverByEmail = async ({
  email,
  include = {},
}: {
  email: string;
  include?: any;
}) => {
  const { driver } = prisma;
  return await driver.findUnique({
    where: {
      email,
    },
    include,
  });
};

const findDriverById = async (id: number) => {
  const { driver } = prisma;
  return await driver.findUnique({
    where: {
      id,
    },
    include: {
      car: true,
    },
  });
};

const findDriverByIdAndEmail = async (id: number, email: string) => {
  const { driver } = prisma;
  return await driver.findUnique({
    where: {
      id,
      email,
    },
    include: {
      car: true,
    },
  });
};

const editDriver = async (driverToBeUpdated: DriverWith) => {
  const { driver } = prisma;
  return await driver.update({
    where: { id: driverToBeUpdated.id },
    data: driverToBeUpdated,
  });
};

const createDriver = async (driverToBeIN: IDriver) => {
  return await prisma.driver.create({ data: driverToBeIN });
};

export {
  findDriverByEmail,
  findDriverById,
  createDriver,
  editDriver,
  findDriverByIdAndEmail,
};
