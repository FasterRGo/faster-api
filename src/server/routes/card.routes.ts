import { Router } from "express";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateCardController } from "../../controller/payment/card";

const create = new CreateCardController()

const cardRoutes = (router: Router): void => {
    router.post("/payment/card", userMiddleWare, create.execute.bind(CreateCardController));
}

export { cardRoutes }