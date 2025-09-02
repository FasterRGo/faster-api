import { Router } from "express";
import { JoinScheduledRideController } from "../../controller/passenger/ride/joinScheduledRideController";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateScheduledRideController } from "../../controller/driver/ride/createScheduledRide";
import { driverMiddleWare } from "../../middleware/driverMiddleware";

const scheduledRideRoutes = (router: Router) => {
  const joinScheduledRideController = new JoinScheduledRideController();
  const createScheduledRideController = new CreateScheduledRideController();

  router.post(
    "/scheduled-ride/join",
    userMiddleWare,
    joinScheduledRideController.execute
  );

  router.post(
    "/scheduled-ride",
    driverMiddleWare,
    createScheduledRideController.execute
  );
};

export { scheduledRideRoutes };
