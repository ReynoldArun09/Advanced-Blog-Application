import app from "./app";
import { ParsedEnvVariables } from "./config/env-variables";

import { logger } from "./utils";

const PORT = ParsedEnvVariables.PORT;

const StartServer = () => {
  app
    .listen(PORT, () => {
      logger.info(`[Server] is running on port ${PORT}`);
    })
    .on("error", (error) => {
      logger.error(error);
    });
};

StartServer();
