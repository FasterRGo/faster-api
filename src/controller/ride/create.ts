import { Request, Response } from "express";
import { hash } from "bcryptjs";
import {
  createRide,
  findUserRideOn,
} from "../../database/repositories/rideRepository";
import { rideValidator } from "../../utils/formValidator/rideValidator";
import { calculate } from "../../service/rideInfo";
import { handleDemoRide } from "../../service/demoService";

class CreateRideController {
  async execute(req: Request, res: Response) {
    try {
      const { from, to } = await rideValidator.validate(req.body);
      const { userId } = req;
      const userHasRideOn = await findUserRideOn(userId);

      if (userHasRideOn) {
        throw new Error("Já há uma corrida em andamento");
      }

      const { price } = await calculate({
        from,
        to,
      });

      const rideData = await createRide({
        finalLatitudeLocation: to.latitude,
        finalLongitudeLocation: to.longitude,
        initialLatitudeLocation: from.latitude,
        initialLongitudeLocation: from.longitude,
        price,
        userId,
      });

      // Se IS_DEMO=true, iniciar processo automático de demo
      if (process.env.IS_DEMO === "true" && rideData.room?.id) {
        // Executar demo de forma assíncrona (não bloquear a resposta)
        handleDemoRide(rideData.ride.id, rideData.room.id).catch((error) => {
          console.error("Erro ao executar demo:", error);
        });
      }

      return res.status(201).json(rideData);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { CreateRideController };
