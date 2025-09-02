import { Router } from "express";
import {
  UserSignInController,
  UserSignUpController,
  UserRefreshController,
} from "../../controller/user/auth/";

const signIn = new UserSignInController();
const signUp = new UserSignUpController();
const refresh = new UserRefreshController();

const userAuthRoutes = (router: Router): void => {
  router.post("/user/auth/sign-in", signIn.execute);
  router.get("/user/auth/refresh", refresh.execute);
  router.post("/user/auth/sign-up", signUp.execute);
};

export { userAuthRoutes };
