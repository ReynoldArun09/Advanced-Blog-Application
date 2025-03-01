import { Router } from "express";
import * as auth from "../controllers/auth-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const authRoutes = Router();

authRoutes.post("/signup-user", auth.SignUpUserApi);
authRoutes.post("/signin-user", auth.SignInUserApi);
authRoutes.post("/signout-user", AuthMiddleware, auth.SignOutUserApi);
authRoutes.get("/verify-user", AuthMiddleware, auth.VerifyUserApi);

export default authRoutes;
