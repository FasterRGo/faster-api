import { Request, Response } from "express";
import { prisma } from "../../service/prisma";

class GetRoomParticipantsController {
  async execute(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      // Verificar se a sala existe
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({ 
          message: "Sala não encontrada" 
        });
      }

      // Buscar participantes ativos
      const participants = await prisma.invite.findMany({
        where: {
          roomId: roomId,
          status: {
            notIn: ["REVOKED", "WATCHER_LEFT"],
          },
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
          Driver: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });

      return res.status(200).json({
        participants,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { GetRoomParticipantsController };

