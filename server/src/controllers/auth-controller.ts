import bcrypt from 'bcryptjs';
import { type Request, type Response } from 'express'
import { AppError, AsyncWrapper } from '../utils'
import { User } from '../models'
import jwt from 'jsonwebtoken'
import { SignInSchemaType, SignUpSchemaType } from '../schemas/auth-schema';
import { ApiErrorMessages, ApiSuccessMessages, HttpStatusCode } from '../constants';
import { ParsedEnvVariables } from '../config/env-variables';
import { JwtType } from '../types';


export const SignUpUserApi = AsyncWrapper(async (req: Request, res: Response) => {
    const { email, username, password } = req.body as SignUpSchemaType

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new AppError(ApiErrorMessages.USER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await User.create({
        email,
        password: hashPassword,
        username
    })

    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ApiSuccessMessages.SINGUP_SUCCESS
    })


})

export const SignInUserApi = AsyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body as SignInSchemaType

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        throw new AppError(ApiErrorMessages.USER_NOT_FOUND, HttpStatusCode.BAD_REQUEST)
    }

    const comparePassword = await bcrypt.compare(password, existingUser?.password)

    if (!comparePassword) {
        throw new AppError(ApiErrorMessages.INCORRECT_PASSWORD, HttpStatusCode.BAD_REQUEST)
    }

    const accessToken = await jwt.sign({
        _id: existingUser._id
    }, ParsedEnvVariables.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

    const refreshToken = await jwt.sign({
        _id: existingUser._id
    }, ParsedEnvVariables.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: ParsedEnvVariables.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: ParsedEnvVariables.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatusCode.OK).json({
        success: true,
        message: ApiSuccessMessages.SIGNIN_SUCCESS,
    })
})

export const VerifyUserApi = AsyncWrapper(async (req: Request, res: Response) => {
    const user = req.user as JwtType;
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: user,
    });
})

export const SignOutUserApi = AsyncWrapper(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: ApiSuccessMessages.SIGNOUT_SUCCESS,
    });
})
