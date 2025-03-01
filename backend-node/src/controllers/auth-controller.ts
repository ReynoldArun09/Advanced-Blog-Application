import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { ParsedEnvVariables } from "../config/env-variables";
import { ApiErrorMessages, ApiSuccessMessages, HttpStatusCode } from "../constants";
import { prisma } from "../lib/prisma";
import { initializeRedisClient } from "../lib/redis";
import { SignInSchema, SignUpSchema } from "../schemas/auth-schema";
import { AppError, AsyncWrapper, getKeyName } from "../utils";

export const SignUpUserApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { email, password, username } = SignUpSchema.parse(req.body);
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("user", email);
  const cachedUser = await client.get(cacheKey);

  if (cachedUser) {
    throw new AppError(ApiErrorMessages.USER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    await client.setEx(cacheKey, 60, JSON.stringify(existingUser));
    throw new AppError(ApiErrorMessages.USER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashPassword,
    },
  });

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: ApiSuccessMessages.SINGUP_SUCCESS,
  });
});

export const SignInUserApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = SignInSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError(ApiErrorMessages.USER_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  const comparePassword = await bcrypt.compare(password, existingUser?.password);

  if (!comparePassword) {
    throw new AppError(ApiErrorMessages.INCORRECT_PASSWORD, HttpStatusCode.BAD_REQUEST);
  }

  const accessToken = await jwt.sign(
    {
      id: existingUser.id,
    },
    ParsedEnvVariables.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = await jwt.sign(
    {
      id: existingUser.id,
    },
    ParsedEnvVariables.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("refreshToken", existingUser.id);
  await client.setEx(cacheKey, 86400, refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: ParsedEnvVariables.NODE_ENV === "production" ? "none" : "strict",
    secure: ParsedEnvVariables.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: ParsedEnvVariables.NODE_ENV === "production" ? "none" : "strict",
    secure: ParsedEnvVariables.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ApiSuccessMessages.SIGNIN_SUCCESS,
  });
});

export const SignOutUserApi = AsyncWrapper(async (req: Request, res: Response) => {
  const user = req.ctx;
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("refreshToken", user.id);
  const authCacheKey = getKeyName("auth-user", user.id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  await client.del(cacheKey);
  await client.del(authCacheKey);
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ApiSuccessMessages.SIGNOUT_SUCCESS,
  });
});

export const VerifyUserApi = AsyncWrapper(async (req: Request, res: Response) => {
  const user = req.ctx;

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: user,
  });
});
