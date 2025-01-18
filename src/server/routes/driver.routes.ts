import { Router } from "express";
import {
  GetDriverController,
  EditDriverController,
} from "../../controller/driver/";
import { driverMiddleWare } from "../../middleware/driverMiddleware";
import { AcceptRideController } from "../../controller/driver/ride/accept";
import { CancelDriverRideController } from "../../controller/driver/ride/cancel";
import { FinishRideController } from "../../controller/driver/ride/finish";

const getDriver = new GetDriverController();
const editDriver = new EditDriverController();
const accept = new AcceptRideController();
const cancel = new CancelDriverRideController();
const finish = new FinishRideController();

const driverRoutes = (router: Router): void => {
  router.get(
    "/driver",
    driverMiddleWare,
    getDriver.execute.bind(GetDriverController)
  );
  router.patch(
    "/driver",
    driverMiddleWare,
    editDriver.execute.bind(EditDriverController)
  );
  router.put(
    "/driver/ride/:rideId",
    driverMiddleWare,
    accept.execute.bind(AcceptRideController)
  );
  router.delete(
    "/driver/ride/:rideId",
    driverMiddleWare,
    cancel.execute.bind(CancelDriverRideController)
  );
  router.put(
    "/driver/ride/:rideId/finish",
    driverMiddleWare,
    finish.execute.bind(FinishRideController)
  );
};

export { driverRoutes };
