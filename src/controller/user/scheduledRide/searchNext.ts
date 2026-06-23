import { Request, Response } from "express";
import * as yup from "yup";
import {
  findNearestScheduledRides,
  findScheduledRidesByCities,
} from "../../../database/repositories/scheduledRideRepository";

const searchNextSchema = yup.object().shape({
  originCity: yup.string().optional().default(""),
  destinationCity: yup.string().optional().default(""),
  originLat: yup.number().optional(),
  originLon: yup.number().optional(),
  destinationLat: yup.number().optional(),
  destinationLon: yup.number().optional(),
  limit: yup.number().optional().min(1).max(100),
});

const ORIGIN_RADIUS_NARROW = 30;
const ORIGIN_RADIUS_WIDE = 80;
const DESTINATION_RADIUS_NARROW = 50;
const DESTINATION_RADIUS_WIDE = 120;

class SearchNextRideController {
  async execute(req: Request, res: Response) {
    try {
      const {
        destinationCity,
        originCity,
        originLat,
        originLon,
        destinationLat,
        destinationLon,
        limit,
      } = await searchNextSchema.validate(req.body, { abortEarly: false });

      const hasCoordinates =
        originLat != null &&
        originLon != null &&
        destinationLat != null &&
        destinationLon != null;

      if (hasCoordinates) {
        // Nível 1 — raio estreito (30km origem / 50km destino)
        let rides = await findNearestScheduledRides({
          fromLatitude: originLat!,
          fromLongitude: originLon!,
          toLatitude: destinationLat!,
          toLongitude: destinationLon!,
          maxOriginRadiusKm: ORIGIN_RADIUS_NARROW,
          maxDestinationRadiusKm: DESTINATION_RADIUS_NARROW,
          limit,
        });

        // Nível 2 — raio ampliado (80km origem / 120km destino)
        if (rides.length === 0) {
          rides = await findNearestScheduledRides({
            fromLatitude: originLat!,
            fromLongitude: originLon!,
            toLatitude: destinationLat!,
            toLongitude: destinationLon!,
            maxOriginRadiusKm: ORIGIN_RADIUS_WIDE,
            maxDestinationRadiusKm: DESTINATION_RADIUS_WIDE,
            limit,
          });
        }

        // Nível 3 — fallback por cidade (quando as coordenadas não geram resultado)
        if (rides.length === 0 && originCity && destinationCity) {
          rides = await findScheduledRidesByCities({
            originCity,
            destinationCity,
            limit,
            userId: req.userId,
          });
        }

        return res.status(200).json(rides);
      }

      // Sem coordenadas — busca direta por cidade
      const rides = await findScheduledRidesByCities({
        destinationCity,
        originCity,
        limit,
        userId: req.userId,
      });

      return res.status(200).json(rides);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
export default SearchNextRideController;
