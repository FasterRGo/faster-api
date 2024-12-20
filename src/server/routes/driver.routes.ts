import { Router } from "express";
import {
  GetDriverController,
  EditDriverController,
} from "../../controller/driver/";
import { driverMiddleWare } from "../../middleware/driverMiddleware";

const getDriver = new GetDriverController();
const editDriver = new EditDriverController();

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
};

export { driverRoutes };
