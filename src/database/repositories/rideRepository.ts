import { prisma } from "../../service/prisma";
import { IRide } from "../../interfaces/";
import { InviteStatus } from "@prisma/client";

const findUserRideOn = async (id: number) => {
  return await prisma.ride.findFirst({
    where: {
      AND: [
        {
          userId: id,
        },
        {
          NOT: [
            {
              OR: [{ status: "CANCELED" }, { status: "FINISHED" }],
            },
          ],
        },
      ],
    },
  });
};

const cancelRide = async (id: number) => {
  return await prisma.ride.updateMany({
    where: {
      AND: [
        {
          id,
        },
        {
          NOT: [
            {
              OR: [
                { status: "CANCELED" },
                { status: "FINISHED" },
                { status: "ACCEPTED" },
                { status: "INITIALIZED" },
              ],
            },
          ],
        },
      ],
    },
    data: {
      status: "CANCELED",
    },
  });
};

const createRide = async (rideToBeIn: IRide) => {
  if (!rideToBeIn.userId) {
    throw new Error("UserId é obrigatório.");
  }

  try {
    const ride = await prisma.ride.create({
      data: {
        ...rideToBeIn,
        Room: {
          create: {
            invites: {
              create: {
                status: InviteStatus.PASSANGER,
                userId: rideToBeIn.userId,
              },
            },
          },
        },
      },
      include: {
        Room: {
          include: {
            invites: {
              where: {
                userId: rideToBeIn.userId,
              },
            },
          },
        },
      },
    });

    console.log("Ride criada com sucesso:", ride);
    return ride;
  } catch (error) {
    console.error("Erro ao criar Ride:", error);
    throw error;
  }
};

export { findUserRideOn, createRide, cancelRide };
