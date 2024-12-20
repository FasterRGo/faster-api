import { prisma } from "../../service/prisma";
import { IDriver } from "../../interfaces/";
import { Driver } from "@prisma/client";

type DriverWith = Omit<Driver, "password" | "createdAt">;

const findDriverByEmail = async (email: string) => {
  const { driver } = prisma;
  return await driver.findUnique({
    where: {
      email,
    },
  });
};

const findDriverById = async (id: number) => {
  const { driver } = prisma;
  return await driver.findUnique({
    where: {
      id,
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

export { findDriverByEmail, findDriverById, createDriver, editDriver };
