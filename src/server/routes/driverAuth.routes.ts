import { Router } from "express";
import {
  DriverSignInController,
  DriverSignUpController,
  DriverRefreshController,
} from "../../controller/driver/auth";

const signIn = new DriverSignInController();
const signUp = new DriverSignUpController();
const refresh = new DriverRefreshController();

const driverAuthRoutes = (router: Router): void => {
  router.post(
    "/driver/auth/sign-in",
    signIn.execute.bind(DriverSignInController)
  );
  router.get(
    "/driver/auth/refresh",
    refresh.execute.bind(DriverRefreshController)
  );
  router.post(
    "/driver/auth/sign-up",
    signUp.execute.bind(DriverSignUpController)
  );
};

export { driverAuthRoutes };
