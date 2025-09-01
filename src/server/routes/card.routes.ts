import { Router } from "express";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateCardController } from "../../controller/payment/card";
import { GetCardController } from "../../controller/payment/card/get";
import { DeleteCardController } from "../../controller/payment/card/delete";

const create = new CreateCardController()
const get = new GetCardController()
const remove = new DeleteCardController()

const cardRoutes = (router: Router): void => {
    router.post("/payment/card", userMiddleWare, create.execute.bind(CreateCardController));
    router.get("/payment/card", userMiddleWare, get.execute.bind(GetCardController));
    router.delete("/payment/card/:id", userMiddleWare, remove.execute.bind(DeleteCardController));
}

export { cardRoutes }