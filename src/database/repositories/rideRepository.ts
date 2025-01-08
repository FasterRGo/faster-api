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
                status: InviteStatus.PASSENGER,
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

const acceptRide = async (driverId: number, rideId: number) => {
  try {
    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: {
        status: "ACCEPTED",
        Room: {
          update: {
            invites: { create: { status: "DRIVER", driverId: driverId } },
          },
        },
      },
      include: {
        Room: {
          include: {
            invites: {
              where: {
                driverId: driverId,
              },
            },
          },
        },
      },
    });

    return ride;
  } catch (error) {
    console.error("Erro ao criar Ride:", error);
    throw error;
  }
};

const cancelDriverRide = async (driverId: number, rideId: number) => {
  try {
    await prisma.ride.update({
      where: { id: rideId },
      data: {
        status: "REQUESTED",
      },
      include: { Room: true },
    });

    const ride = await prisma.ride.findUnique({
      where: {
        id: rideId,
      },
      include: { Room: true },
    });

    if (!ride || !ride.Room) {
      return;
    }

    await prisma.invite.deleteMany({
      where: {
        AND: [{ roomId: ride.Room.id }, { driverId }],
      },
    });

    return ride;
  } catch (error) {
    console.error("Erro ao criar Ride:", error);
    throw error;
  }
};

export { findUserRideOn, createRide, cancelRide, acceptRide, cancelDriverRide };
