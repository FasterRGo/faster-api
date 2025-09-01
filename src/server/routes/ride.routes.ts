import { Router } from "express";
import {
  CalculateRideController,
  CancelRideController,
  CreateRideController,
  GetRideController,
} from "../../controller/ride/";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { ListRideController } from "../../controller/ride/list";
import { EvaluateRideController } from "../../controller/ride/evaluate";

const create = new CreateRideController();
const calculate = new CalculateRideController();
const cancel = new CancelRideController();
const get = new GetRideController();

const list = new ListRideController();
const evaluate = new EvaluateRideController();

const rideRoutes = (router: Router): void => {
  router.post(
    "/ride",
    userMiddleWare,
    create.execute.bind(CreateRideController)
  );
  router.get("/ride", userMiddleWare, list.execute.bind(ListRideController));
  router.post(
    "/ride/:id/evaluate",
    userMiddleWare,
    evaluate.execute.bind(EvaluateRideController)
  );
  router.post(
    "/ride/calculate",
    userMiddleWare,
    calculate.execute.bind(CalculateRideController)
  );
  router.get(
    "/ride/:rideId",
    userMiddleWare,
    get.execute.bind(GetRideController)
  );
  router.delete(
    "/ride/:rideId",
    userMiddleWare,
    cancel.execute.bind(CancelRideController)
  );
};

export { rideRoutes };
