import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { ParsedEnvVariables } from "./config/env-variables";
import { ErrorHandler } from "./middlewares/error-middleware";
import { authRoutes, commentRoutes, postRoutes } from "./routes";

const app: Application = express();
const swaggerSpec = YAML.load("./src/docs/swagger.yaml");

app.use(express.json());
app.use(
  cors({
    origin: ParsedEnvVariables.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());

if (ParsedEnvVariables.NODE_ENV === "development") {
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.use(ErrorHandler);

export default app;
