import { Router } from "express";
import { JoinScheduledRideController } from "../../controller/passenger/ride/joinScheduledRideController";
import { ensureAuth } from "../middlewares/ensureAuth";

const scheduledRideRoutes = (router: Router) => {
  const joinScheduledRideController = new JoinScheduledRideController();

  router.post("/scheduled-ride/join", ensureAuth, joinScheduledRideController.execute);
};

export { scheduledRideRoutes };
