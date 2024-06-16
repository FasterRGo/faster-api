import { Router } from "express";
import { userAuthRoutes } from "./userAuth.routes";

const router = Router();
userAuthRoutes(router)

export { router }