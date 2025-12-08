import { Request, Response } from "express";
import { prisma } from "../../service/prisma";
import { InviteStatus } from "@prisma/client";
import { createInvite } from "../../database/repositories/inviteRepository";

class JoinRoomController {
  async execute(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { invite: inviteCode, roomId } = req.body;

      if (!inviteCode || !roomId) {
        return res.status(400).json({ 
          message: "Código do invite e roomId são obrigatórios" 
        });
      }

      // Validar se o invite existe e está associado ao roomId
      const existingInvite = await prisma.invite.findFirst({
        where: {
          id: inviteCode,
          roomId: roomId,
        },
        include: {
          Room: true,
        },
      });

      if (!existingInvite) {
        return res.status(404).json({ 
          message: "Invite não encontrado ou não associado a esta sala" 
        });
      }

      if (existingInvite.status === "REVOKED") {
        return res.status(400).json({ 
          message: "Este invite foi revogado" 
        });
      }

      // Verificar se o usuário já tem um invite nesta sala
      const userInvite = await prisma.invite.findFirst({
        where: {
          userId: userId,
          roomId: roomId,
        },
      });

      let invite;
      if (userInvite) {
        // Atualizar invite existente
        invite = await prisma.invite.update({
          where: { id: userInvite.id },
          data: {
            status: "IN_USE",
          },
        });
      } else {
        // Criar novo invite para o usuário
        invite = await createInvite({
          status: InviteStatus.IN_USE,
          userId: userId,
          roomId: roomId,
          driverId: null,
          email: null,
          socketId: null,
          createdBy: "SYSTEM",
        });
      }

      return res.status(200).json({
        message: "Usuário entrou na sala com sucesso",
        invite,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { JoinRoomController };

