import { Router } from "express";
import { JoinScheduledRideController } from "../../controller/passenger/ride/joinScheduledRideController";
import { userMiddleWare } from "../../middleware/userMiddleware";

const scheduledRideRoutes = (router: Router) => {
  const joinScheduledRideController = new JoinScheduledRideController();

  router.post(
    "/scheduled-ride/join",
    userMiddleWare,
    joinScheduledRideController.execute
  );
};

export { scheduledRideRoutes };
