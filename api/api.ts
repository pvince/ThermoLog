/**
 * @file //TODO_PTV: Update the description
 */

// Third party modules
import * as exegesisExpress from "exegesis-express";
import path from "path";

// Our modules
import app from "../app";

import debug0 from "debug";

// Weather Station Acurite API Routes
import updateWeatherStation from "./routes/weatherstation/updateWeatherStation";

const debug = debug0("thermolog:exegesis");

const INT_32_MAX = Math.pow(2, 32) - 1;
const INT_32_MIN = -1 * Math.pow(2, 32);

const INT_64_MIN = Number.MIN_SAFE_INTEGER;
const INT_64_MAX = Number.MAX_SAFE_INTEGER;

/**
 * Registers special methods used by the smartHUB API.
 * @private
 */
function _registerSmartHub() {
  debug("Registering smartHUB routes");
  app.use("/weatherstation", updateWeatherStation);
}

/**
 * Creates & registers the exegesis middleware.
 * @returns {Promise<Object>} - Returns a promise that resolves to the exegesisMiddleware
 */
export function registerExegesisMW(): Promise<exegesisExpress.MiddlewareFunction> {
  const options: exegesisExpress.ExegesisOptions = {
    allowMissingControllers: false,
    autoHandleHttpErrors: true,
    controllers: path.resolve(__dirname, "./controllers"),
    customFormats: {
      int32: {
        type: "number",
        validate: (value: number): boolean => value >= INT_32_MIN && value <= INT_32_MAX
      },
      int64: {
        type: "number",
        validate: (value: number): boolean => value >= INT_64_MIN && value <= INT_64_MAX
      }
    }
  };

  _registerSmartHub();

  debug("Creating the exegesis middleware...");

  return exegesisExpress.middleware(
      path.resolve(__dirname, "./spec/openapi.yaml"),
      options
    )
    .then((exegesisMW) => {
      app.use(exegesisMW);
      debug("Exegesis middleware created & registered.");

      return exegesisMW;
    });
}
