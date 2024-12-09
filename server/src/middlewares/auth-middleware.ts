import { RequestHandler } from "express";
import {
  ApiErrorMessages,
  GlobalErrorMessages,
  HttpStatusCode,
} from "../constants";

import { AppError } from "../utils";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { JwtType } from "../types";
import { ParsedEnvVariables } from "../config/env-variables";

export const AuthMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: GlobalErrorMessages.UNAUTHORIZED });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      ParsedEnvVariables.ACCESS_TOKEN_SECRET
    ) as JwtType;

    const existingUser = await User.findById(decoded._id)

    if (!existingUser) {
      throw new AppError(
        ApiErrorMessages.INVALID_TOKEN,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const user = {
      _id: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
    }

    req.user = user
    next();
  } catch (error) {
    next(error);
  }
};
