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

const cancelRide = async (id: string) => {
  return await prisma.ride.update({
    where: {
      id,
      AND: {
        NOT: {
          OR: [
            { status: "CANCELED" },
            { status: "FINISHED" },
            { status: "ACCEPTED" },
            { status: "INITIALIZED" },
          ],
        },
      },
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
      },
    });

    const room = await prisma.room.create({
      data: {
        Ride: {
          connect: { id: ride.id },
        },
        invites: { create: { status: "PASSENGER", userId: rideToBeIn.userId } },
      },
      include: { invites: true },
    });

    const updatedRide = await prisma.ride.update({
      where: { id: ride.id },
      data: { roomId: room.id },
    });

    console.log("Ride criada com sucesso:", ride);
    return { ride: updatedRide, room };
  } catch (error) {
    console.error("Erro ao criar Ride:", error);
    throw error;
  }
};

const acceptRide = async (driverId: number, rideId: string) => {
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

const cancelDriverRide = async (driverId: number, rideId: string) => {
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

const finishRide = async (rideId: string) => {
  await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "FINISHED",
      Room: {
        update: {
          active: false,
        },
      },
    },
  });
};

const getActiveRide = async ({
  userId,
  driverId,
}: {
  userId?: number;
  driverId?: number;
}) => {
  if (!userId && !driverId) {
    throw new Error("No id informed");
  }

  return await prisma.invite.findFirst({
    where: {
      ...(userId && { userId }),
      ...(driverId && { driverId }),
      AND: [
        {
          Room: {
            Ride: {
              OR: [
                {
                  status: "REQUESTED",
                },
                { status: "ACCEPTED" },
                { status: "INITIALIZED" },
              ],
            },
          },
        },
      ],
    },
  });
};

export {
  findUserRideOn,
  createRide,
  cancelRide,
  acceptRide,
  cancelDriverRide,
  finishRide,
  getActiveRide,
};
