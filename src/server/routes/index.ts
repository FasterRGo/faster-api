import { Router } from "express";
import { userAuthRoutes } from "./userAuth.routes";
import { rideRoutes } from "./ride.routes";
import { userRoutes } from "./user.routes";
import { commonPlacesRoutes } from "./commonPlaces.routes";

const router = Router();

userAuthRoutes(router)
rideRoutes(router)
userRoutes(router)
commonPlacesRoutes(router)

export { router }