import { Router } from "express";
import { GetCommonPlacesController, CreateCommonPlacesController } from "../../controller/commonPlaces/index";
import { userMiddleWare } from "../../middleware/userMiddleware";

const get = new GetCommonPlacesController()
const create = new CreateCommonPlacesController()

const commonPlacesRoutes = (router: Router): void => {
    router.get("/common-places", userMiddleWare, get.execute.bind(GetCommonPlacesController));
    router.post("/common-places", userMiddleWare, create.execute.bind(CreateCommonPlacesController));
}

export { commonPlacesRoutes }