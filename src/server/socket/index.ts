import { Server } from "socket.io";
import { prisma } from "../../service/prisma";
import {
  findInviteBySocketId,
  updateInviteStatus,
  updateSocketIdOfAInvite,
} from "../../database/repositories/inviteRepository";

interface RoomMessage {
  roomName: string;
  message: string;
}

interface Connection {
  userId: number;
  invite: number;
}

interface JoinRoom {
  roomName: string;
  invite: number;
}

export const webSocket = (app: any) => {
  const io = new Server(app, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("connection", async (data: Connection) => {
      const { invite, userId } = data;

      const room = await prisma.invite.findUnique({
        where: {
          id: invite,
          User: { id: userId },
        },
        include: {
          Room: {
            include: {
              invites: {
                where: {
                  userId: userId,
                },
              },
            },
          },
        },
      });

      if (room) {
        socket.join(room.roomId);
        console.log(`Usuário ${socket.id} entrou na sala ${room.id}`);

        await updateSocketIdOfAInvite(invite, socket.id);
      }
    });

    socket.on("acceptRide", async (room: JoinRoom) => {
      socket.join(room.roomName);
      io.to(room.roomName).emit(
        "driverJoined",
        `Usuário ${socket.id} entrou na sala.`
      );

      console.log(
        `Motorista ${socket.id} aceitou a corrida na sala ${room.roomName}`
      );
    });

    socket.on("joinRoom", async (roomName: JoinRoom) => {
      if (!roomName) {
        return;
      }

      const room = await prisma.invite.findUnique({
        where: {
          id: roomName.invite,
          Room: { id: roomName.roomName },
        },
      });

      if (!room) {
        socket.join(`obj.roomName`);
        socket
          .to(`obj.roomName`)
          .emit("message", `Usuário ${socket.id} entrou na sala.`);
        return;
      }

      const obj = roomName;

      await updateSocketIdOfAInvite(roomName.invite, socket.id);

      if (room?.status !== "DRIVER" && room?.status !== "PASSENGER") {
        await updateInviteStatus(roomName.invite, "IN_USE");
      }

      socket.join(obj.roomName);
      socket
        .to(obj.roomName)
        .emit("message", `Usuário ${socket.id} entrou na sala.`);
    });

    socket.on("updateLocation", (data: RoomMessage) => {
      const { roomName } = data;
      io.to(roomName).emit("updateLocation", data);
    });

    socket.on("chat", (data: RoomMessage) => {
      const { roomName, message } = data;

      io.to(roomName).emit("chat", `${socket.id}: ${message}`);
    });

    socket.on("message", (data: RoomMessage) => {
      const { roomName, message } = data;

      io.to(roomName).emit("message", `${socket.id}: ${message}`);
    });

    socket.on("leaveRoom", async (roomName: string) => {
      socket.leave(roomName);
      console.log(`Usuário ${socket.id} saiu da sala ${roomName}`);
      socket.to(roomName).emit("message", `Usuário ${socket.id} saiu da sala.`);
      const invite = await findInviteBySocketId(socket.id);

      if (invite) {
        await updateInviteStatus(invite.id, "WATCHER_LEFT");
      }
    });

    // Evento ao desconectar
    socket.on("disconnect", async () => {
      console.log(`Usuário desconectado: ${socket.id}`);

      const invite = await findInviteBySocketId(socket.id);

      if (invite) {
        await updateInviteStatus(invite.id, "WATCHER_LEFT");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Erro de conexão:", err.message);
    });
  });

  app.listen(3030, () => {
    console.log(
      `Servidor rodando em http://localhost:${3030} e wss://localhost:${3030}`
    );
  });

  return io;
};
