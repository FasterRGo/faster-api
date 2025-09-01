import { Router } from "express";
import { userAuthRoutes } from "./userAuth.routes";
import { rideRoutes } from "./ride.routes";
import { userRoutes } from "./user.routes";
import { commonPlacesRoutes } from "./commonPlaces.routes";
import { cardRoutes } from "./card.routes";
import { driverRoutes } from "./driver.routes";
import { driverAuthRoutes } from "./driverAuth.routes";
import { carRoutes } from "./car.routes";

const router = Router();

userAuthRoutes(router);
rideRoutes(router);
userRoutes(router);
commonPlacesRoutes(router);
cardRoutes(router);
driverRoutes(router);
driverAuthRoutes(router);
carRoutes(router);

export { router };
