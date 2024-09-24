import { Router } from "express";
import { userAuthRoutes } from "./userAuth.routes";
import { rideRoutes } from "./ride.routes";
import { userRoutes } from "./user.routes";

const router = Router();

userAuthRoutes(router)
rideRoutes(router)
userRoutes(router)

export { router }