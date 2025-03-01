import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ParsedEnvVariables } from "../config/env-variables";
import { ApiErrorMessages, GlobalErrorMessages, HttpStatusCode } from "../constants";
import { prisma } from "../lib/prisma";
import { initializeRedisClient } from "../lib/redis";
import { ContextType } from "../types";
import { AppError, getKeyName } from "../utils";

export const AuthMiddleware: RequestHandler = async (req, res, next): Promise<any> => {
  const accessToken = req.cookies.accessToken;

  try {
    if (!accessToken) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: GlobalErrorMessages.UNAUTHORIZED });
    }
    const decoded = jwt.verify(accessToken, ParsedEnvVariables.ACCESS_TOKEN_SECRET) as ContextType;

    const client = await initializeRedisClient();
    const Cachekey = getKeyName("auth-user", decoded.id);

    const cachedUser = await client.get(Cachekey);

    if (cachedUser) {
      req.ctx = JSON.parse(cachedUser);
      return next();
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!existingUser) {
      throw new AppError(ApiErrorMessages.INVALID_TOKEN, HttpStatusCode.UNAUTHORIZED);
    }

    await client.setEx(Cachekey, 3600, JSON.stringify(existingUser));

    req.ctx = existingUser;
    next();
  } catch (error) {
    next(error);
  }
};
