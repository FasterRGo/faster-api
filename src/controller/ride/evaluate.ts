import { Request, Response } from "express";
import { prisma } from "../../service/prisma";

class EvaluateRideController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rate, description } = req.body;

      if (!id || !rate) {
        return res
          .status(400)
          .json({ message: "rideId e rate são obrigatórios" });
      }

      const ride = await prisma.ride.findUnique({
        where: { id: id as string },
        include: {
          Rate: { where: { commentedBy: "PASSENGER" } },
        },
      });

      if (!ride) {
        return res.status(404).json({ message: "Corrida não encontrada" });
      }

      if (ride.status !== "FINISHED") {
        return res.status(400).json({
          message: "A corrida precisa estar finalizada para ser avaliada",
        });
      }

      const existingRate = ride.Rate[0];

      let rating;
      if (existingRate) {
        // Atualiza avaliação existente
        rating = await prisma.rate.update({
          where: { id: existingRate.id },
          data: { rate, description },
        });
      } else {
        // Cria nova avaliação
        rating = await prisma.rate.create({
          data: {
            commentedBy: "PASSENGER",
            description,
            rate,
            rideId: ride.id,
          },
        });
      }

      return res.status(200).json(rating);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export { EvaluateRideController };
