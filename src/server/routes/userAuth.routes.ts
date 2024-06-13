import { Router } from "express";
import { UserSignInController, UserSignUpController } from "../../controller/user/auth/";

const signIn = new UserSignInController()
const signUp = new UserSignUpController()

const userAuthRoutes = (router: Router): void => {
    router.get("/user/auth/sign-in", signIn.execute.bind(UserSignInController));
    router.post("/user/auth/sign-up", signUp.execute.bind(UserSignUpController));
}

export { userAuthRoutes }