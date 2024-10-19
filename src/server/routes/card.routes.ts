import { Router } from "express";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateCardController } from "../../controller/payment/card";
import { GetCardController } from "../../controller/payment/card/get";

const create = new CreateCardController()
const get = new GetCardController()

const cardRoutes = (router: Router): void => {
    router.post("/payment/card", userMiddleWare, create.execute.bind(CreateCardController));
    router.get("/payment/card", userMiddleWare, get.execute.bind(GetCardController));
}

export { cardRoutes }