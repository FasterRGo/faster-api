import { Request, Response } from "express";
import { prisma } from "../../service/prisma";

class GetUserInviteInRoomController {
  async execute(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const userId = req.userId;

      const invite = await prisma.invite.findFirst({
        where: {
          roomId: roomId,
          userId: userId,
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

      if (!invite) {
        return res.status(404).json({ 
          message: "Invite não encontrado para este usuário nesta sala" 
        });
      }

      return res.status(200).json({
        invite,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { GetUserInviteInRoomController };

