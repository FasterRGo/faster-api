import { prisma } from "../../service/prisma";
import { IRide } from "../../interfaces/";
import { InviteStatus } from "@prisma/client";
import { IRideSchedule } from "../../interfaces/rideSchedule";

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
  console.log(id);
  return await prisma.ride.update({
    where: {
      id,
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

    return { ride: updatedRide, room };
  } catch (error) {
    console.error("Erro ao criar Ride:", error);
    throw error;
  }
};

const createScheduledRide = async (rideToBeIn: IRideSchedule) => {
  if (!rideToBeIn.driverId) {
    throw new Error("UserId é obrigatório.");
  }

  try {
    const ride = await prisma.scheduledRide.create({
      data: {
        ...rideToBeIn,
        status: "CREATED",
        maxPassengers: rideToBeIn.maxPassengers,
        originLabel: rideToBeIn.originLabel,
        destinationLabel: rideToBeIn.destinationLabel,
      },
    });

    return { ride };
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
        Driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            photo: true,
            car: {
              select: {
                id: true,
                model: true,
                plate: true,
              },
              take: 1,
            },
          },
        },
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

const finishRide = async (rideId: string, io?: any) => {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    select: { roomId: true },
  });

  if (!ride) {
    throw new Error("Corrida não encontrada");
  }

  const rideUpdated = await prisma.ride.update({
    where: { id: rideId },
    data: {
      status: "FINISHED",
      Room: {
        update: {
          active: false,
        },
      },
    },
    include: {
      Room: true,
    },
  });

  console.log(`✅ [FINISH RIDE] Corrida ${rideId} atualizada para status: FINISHED`);
  console.log(`   Room ${ride.roomId} desativado: ${rideUpdated.Room?.active === false ? 'Sim' : 'Não'}`);

  // Notificar via WebSocket se io estiver disponível
  if (io && ride.roomId) {
    io.to(ride.roomId).emit("rideFinished", {
      rideId,
      message: "Corrida finalizada com sucesso.",
      status: "FINISHED",
    });
    console.log(`📡 [FINISH RIDE] Evento 'rideFinished' emitido para a sala ${ride.roomId}`);
  }

  return rideUpdated;
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
    include: { Room: { include: { Ride: true } } },
  });
};

const cancelOlderThan7MinutesRide = async (io: any) => {
  const sevenMinutesAgo = new Date(Date.now() - 7 * 60 * 1000);

  const ridesToCancel = await prisma.ride.findMany({
    where: {
      status: "REQUESTED",
      createdAt: { lte: sevenMinutesAgo },
    },
    select: {
      id: true,
      roomId: true,
    },
  });

  if (ridesToCancel.length === 0) return;

  await prisma.ride.updateMany({
    where: {
      id: { in: ridesToCancel.map((ride) => ride.id) },
    },
    data: { status: "CANCELED" },
  });

  ridesToCancel.forEach((ride) => {
    io.to(ride.roomId).emit("rideCancelled", {
      message: "Esta corrida foi cancelada por inatividade.",
    });
  });
};

async function offerRides(socket: any) {
  try {
    // Buscar motoristas disponíveis
    const drivers = await prisma.driver.findMany({
      where: { isWorking: true, socketId: { not: null } },
    });

    // Buscar corridas com status 'Requested'
    const rides = await prisma.ride.findMany({
      where: { status: "REQUESTED" },
      take: drivers.length,
      include: { User: true },
    });

    if (rides.length === 0 || drivers.length === 0) {
      console.log("Nenhuma corrida ou motorista disponível no momento.");
      return;
    }

    // Emitir evento para os motoristas
    for (let i = 0; i < Math.min(drivers.length, rides.length); i++) {
      const driver = drivers[i];
      const ride = rides[i];

      socket.to(driver.socketId).emit("mightRide", {
        rideId: ride.id,
        initialLatitude: ride.initialLatitudeLocation,
        initialLongitude: ride.initialLongitudeLocation,
        destinationLatitude: ride.finalLatitudeLocation,
        destinationLongitude: ride.finalLongitudeLocation,
        passengerName: ride.User.name,
        roomId: ride.roomId,
        price: ride.price,
      });

      console.log(
        `Oferta enviada para motorista ${driver.id} sobre a corrida ${ride.id}`
      );
    }
  } catch (error) {
    console.error("Erro ao oferecer corridas:", error);
  }
}

const joinScheduledRide = async (
  scheduledRideId: string,
  userId: number,
  numberOfSeatsBought: number
) => {
  try {
    const scheduledRide = await prisma.scheduledRide.findUnique({
      where: { id: scheduledRideId },
      include: { ScheduledRidePassenger: true },
    });

    if (!scheduledRide) {
      throw new Error("Corrida agendada não encontrada.");
    }

    if (
      scheduledRide.ScheduledRidePassenger.length >= scheduledRide.maxPassengers
    ) {
      throw new Error(
        "Limite de passageiros atingido para esta corrida agendada."
      );
    }

    const existingPassenger = scheduledRide.ScheduledRidePassenger.find(
      (passenger) => passenger.userId === userId
    );

    if (existingPassenger) {
      throw new Error("Você já está participando desta corrida agendada.");
    }

    const scheduledRidePassenger = await prisma.scheduledRidePassenger.create({
      data: {
        scheduledRideId,
        userId,
        numberOfSeatsBought,
        status: "CONFIRMED", // Ou um status inicial apropriado
      },
    });

    return scheduledRidePassenger;
  } catch (error) {
    console.error("Erro ao entrar na corrida agendada:", error);
    throw error;
  }
};

export {
  findUserRideOn,
  createRide,
  cancelRide,
  acceptRide,
  cancelDriverRide,
  finishRide,
  getActiveRide,
  cancelOlderThan7MinutesRide,
  offerRides,
  createScheduledRide,
  joinScheduledRide,
};
