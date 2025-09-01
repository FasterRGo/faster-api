import { prisma } from "../../service/prisma";
import { Car } from "@prisma/client";

type ICar = Omit<Car, "id" | "createdAt" | "updatedAt">;

const listCars = async (id: number) => {
  return await prisma.car.findMany({
    where: {
      driverId: id,
    },
    select: {
      id: true,
      brand: true,
      model: true,
      plate: true,
      chassi: true,
    },
  });
};

const createCars = async (car: ICar) => {
  return await prisma.car.create({
    data: car,
  });
};

const deleteCar = async (id: number) => {
  return await prisma.car.delete({
    where: {
      id,
    },
  });
};

export { listCars, createCars, deleteCar };
