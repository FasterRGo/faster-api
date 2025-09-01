import { Router } from "express";
import { GetUserController, EditUserController } from "../../controller/user/";
import { userMiddleWare } from "../../middleware/userMiddleware";

const getUser = new GetUserController()
const editUser = new EditUserController()

const userRoutes = (router: Router): void => {
    router.get("/user", userMiddleWare, getUser.execute.bind(GetUserController));
    router.patch("/user", userMiddleWare, editUser.execute.bind(EditUserController));
}

export { userRoutes }