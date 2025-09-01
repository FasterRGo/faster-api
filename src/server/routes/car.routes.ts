import { Router } from "express";
import { CreateCarsController } from "../../controller/driver/car/create";
import { driverMiddleWare } from "../../middleware/driverMiddleware";

const createCar = new CreateCarsController();

const carRoutes = (router: Router): void => {
  router.post(
    "/driver/car",
    driverMiddleWare,
    createCar.execute.bind(CreateCarsController)
  );
};

export { carRoutes };
