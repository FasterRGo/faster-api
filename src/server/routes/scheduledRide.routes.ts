import { Router } from "express";
import { JoinScheduledRideController } from "../../controller/passenger/ride/joinScheduledRideController";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateScheduledRideController } from "../../controller/driver/ride/createScheduledRide";
import { driverMiddleWare } from "../../middleware/driverMiddleware";
import SearchNextRideController from "../../controller/user/scheduledRide/searchNext";
import GetScheduledRideController from "../../controller/user/scheduledRide/get";

const scheduledRideRoutes = (router: Router) => {
  const joinScheduledRideController = new JoinScheduledRideController();
  const createScheduledRideController = new CreateScheduledRideController();
  const searchNextRideController = new SearchNextRideController();
  const getScheduledRideController = new GetScheduledRideController();

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

  router.get("/scheduled-ride", getScheduledRideController.execute);

  router.post("/scheduled-ride/search-next", searchNextRideController.execute);
};

export { scheduledRideRoutes };
