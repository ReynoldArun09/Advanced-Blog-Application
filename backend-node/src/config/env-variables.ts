import dotenv from "dotenv";
import { z } from "zod";
import { GlobalErrorMessages, ValidationMessages } from "../constants";
import { logger } from "../utils";

dotenv.config();

const EnvVariables = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  ACCESS_TOKEN_SECRET: z.string().min(10, { message: ValidationMessages.ACCESS_TOKEN_SECRET_LENGTH }),
  REFRESH_TOKEN_SECRET: z.string().min(10, { message: ValidationMessages.REFRESH_TOKEN_SECRET_LENGTH }),
  CORS_ORIGIN: z.string().min(1, { message: ValidationMessages.CORS_ORIGIN_REQUIRED }),
});

export type EnvVariablesType = z.infer<typeof EnvVariables>;

const envVariables = (): EnvVariablesType => {
  try {
    return EnvVariables.parse(process.env);
  } catch (error) {
    logger.error(GlobalErrorMessages.ENV_PARSE_ERROR, error);
    process.exit(1);
  }
};

export const ParsedEnvVariables = envVariables();
