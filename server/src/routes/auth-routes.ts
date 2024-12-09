import { Router } from "express";
import * as auth from '../controllers/auth-controller'
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";
import { SignInSchema, SignUpSchema } from "../schemas/auth-schema";

const authRoutes = Router()

authRoutes.post("/signup-user", ValidationMiddleware(SignUpSchema), auth.SignUpUserApi)
authRoutes.post("/signin-user", ValidationMiddleware(SignInSchema), auth.SignInUserApi)
authRoutes.post("/signout-user", auth.SignOutUserApi)
authRoutes.get("/verify-user", AuthMiddleware, auth.VerifyUserApi)

export default authRoutes
