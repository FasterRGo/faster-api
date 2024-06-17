import { Router } from "express";
import { CalculateRideController, CreateRideController } from "../../controller/ride/";
import { userMiddleWare } from "../../middleware/userMiddleware";

const create = new CreateRideController()
const calculate = new CalculateRideController()

const rideRoutes = (router: Router): void => {
    router.post("/ride", userMiddleWare, create.execute.bind(CreateRideController));
    router.post("/ride/calculate", userMiddleWare, calculate.execute.bind(CalculateRideController));
}

export { rideRoutes }