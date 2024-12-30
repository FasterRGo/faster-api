import { Server } from "socket.io";
import { prisma } from "../../service/prisma";

interface RoomMessage {
  roomName: string;
  message: string;
}

interface Connection {
  userId: number;
  invite: number;
}

export const webSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
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

      if (!room) {
        console.log("no room");
      }

      console.log(room);

      // console.log(`Usuário ${socket.id} entrou na sala ${room.id}`);
    });

    socket.on("joinRoom", async (roomName: any) => {
      if (!roomName) {
        return;
      }

      const room = await prisma.invite.findUnique({
        where: {
          id: roomName.roomName,
        },
      });

      if (!room) {
        console.log("no room");
      }

      console.log(room);

      const obj = roomName;

      console.log(`Usuário ${socket.id} entrou na sala ${obj.roomName}`);
      socket.join(obj.roomName);
      console.log(`Usuário ${socket.id} entrou na sala ${obj.roomName}`);
      socket
        .to(obj.roomName)
        .emit("message", `Usuário ${socket.id} entrou na sala.`);
    });

    socket.on("sendMessage", (data: RoomMessage) => {
      const { roomName, message } = data;

      io.to(roomName).emit("message", `${socket.id}: ${message}`);
    });

    socket.on("leaveRoom", (roomName: string) => {
      console.log(socket);
      socket.leave(roomName);
      console.log(`Usuário ${socket.id} saiu da sala ${roomName}`);
      socket.to(roomName).emit("message", `Usuário ${socket.id} saiu da sala.`);
    });

    // Evento ao desconectar
    socket.on("disconnect", () => {
      console.log(socket);
      console.log(`Usuário desconectado: ${socket.id}`);
    });

    socket.on("connect_error", (err) => {
      console.error("Erro de conexão:", err.message);
    });
  });

  httpServer.listen(3031, () => {
    console.log(`Servidor rodando na porta ${3031}`);
  });
};
