import { Request, Response } from "express";
import { createInvite } from "../../database/repositories/inviteRepository";
import { InviteStatus } from "@prisma/client";
import { prisma } from "../../service/prisma";

class CreateInviteController {
  async execute(req: Request, res: Response) {
    try {
      const userId = req.userId; // Obtido do middleware de autenticação
      const { roomId, status, email, isDriver } = req.body;

      // Validações básicas
      if (!roomId) {
        return res.status(400).json({ message: "roomId é obrigatório" });
      }

      if (!userId) {
        return res.status(401).json({
          message: "Usuário não autenticado",
        });
      }

      // Verificar se a Room existe
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({
          message: "Sala não encontrada. O roomId fornecido não existe.",
        });
      }

      // Define o status padrão se não fornecido
      // Se isDriver for true, cria invite para motorista, senão para passageiro
      const inviteStatus =
        status || (isDriver ? InviteStatus.DRIVER : InviteStatus.PASSENGER);

      // Cria o invite
      const invite = await createInvite({
        status: inviteStatus,
        roomId: roomId,
        userId: isDriver ? null : userId, // Se for motorista, userId é null
        driverId: isDriver ? userId : null, // Se for motorista, driverId recebe o userId
        email: email || null,
        socketId: null,
        createdBy: isDriver ? "DRIVER" : "PASSENGER",
      });

      return res.status(201).json({
        message: "Invite criado com sucesso",
        invite,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { CreateInviteController };
