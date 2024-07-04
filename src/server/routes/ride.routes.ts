import { Router } from "express";
import { CalculateRideController, CancelRideController, CreateRideController, GetRideController } from "../../controller/ride/";
import { userMiddleWare } from "../../middleware/userMiddleware";

const create = new CreateRideController()
const calculate = new CalculateRideController()
const cancel = new CancelRideController()
const get = new GetRideController()

const rideRoutes = (router: Router): void => {
    router.post("/ride", userMiddleWare, create.execute.bind(CreateRideController));
    router.post("/ride/calculate", userMiddleWare, calculate.execute.bind(CalculateRideController));
    router.get("/ride/:rideId", userMiddleWare, get.execute.bind(GetRideController));
    router.patch("/ride/cancel/:rideId", userMiddleWare, cancel.execute.bind(CancelRideController));
}

export { rideRoutes }