import { Router } from "express";
import { UserSignInController, UserSignUpController, UserRefreshController } from "../../controller/user/auth/";

const signIn = new UserSignInController()
const signUp = new UserSignUpController()
const refresh = new UserRefreshController()

const userAuthRoutes = (router: Router): void => {
    router.get("/user/auth/sign-in", signIn.execute.bind(UserSignInController));
    router.get("/user/auth/refresh", refresh.execute.bind(UserRefreshController));
    router.post("/user/auth/sign-up", signUp.execute.bind(UserSignUpController));
}

export { userAuthRoutes }