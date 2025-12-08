import { Request, Response } from "express";
import { prisma } from "../../service/prisma";

class GetRideByRoomIdController {
  async execute(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      // Buscar a corrida pelo roomId
      const ride = await prisma.ride.findFirst({
        where: {
          roomId: roomId,
        },
        include: {
          Driver: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              photo: true,
            },
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });

      if (!ride) {
        return res.status(404).json({ 
          message: "Corrida não encontrada para esta sala" 
        });
      }

      return res.status(200).json({
        ride,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { GetRideByRoomIdController };

