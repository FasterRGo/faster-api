import { Request, Response } from "express";
import { prisma } from "../../service/prisma";

class EvaluateRideController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rate, description } = req.body;
      const { userId } = req; // Pega o ID do motorista autenticado

      console.log(id);
      console.log(rate);

      if (!id || !rate) {
        return res
          .status(400)
          .json({ message: "rideId e rate são obrigatórios" });
      }
      console.log("here2");

      // Busca a corrida pelo ID
      const ride = await prisma.ride.findUnique({
        where: { id: id as string },
        include: {
          Rate: { where: { commentedBy: "PASSENGER" } },
        },
      });
      console.log("here3");

      if (!ride) {
        return res.status(404).json({ message: "Corrida não encontrada" });
      }
      console.log("here4");

      if (ride.status !== "FINISHED") {
        return res.status(400).json({
          message: "A corrida precisa estar finalizada para ser avaliada",
        });
      }
      console.log("here5");

      if (ride.Rate.length > 0) {
        return res
          .status(400)
          .json({ message: "Esta corrida já foi avaliada" });
      }
      console.log("here7");

      const rating = await prisma.rate.create({
        data: {
          commentedBy: "PASSENGER",
          description,
          rate,
          rideId: ride.id,
        },
      });
      console.log("here8");

      return res.status(201).json(rating);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export { EvaluateRideController };
