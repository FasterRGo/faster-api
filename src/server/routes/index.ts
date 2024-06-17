import { Router } from "express";
import { userAuthRoutes } from "./userAuth.routes";
import { rideRoutes } from "./ride.routes";

const router = Router();
userAuthRoutes(router)
rideRoutes(router)

export { router }