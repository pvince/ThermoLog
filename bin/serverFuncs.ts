/**
 * @file //TODO_PTV: Update the description
 */

import debug0 from "debug";
import http, {RequestListener} from "http";
import _ from "lodash";
import config from "../services/config";

const debug = debug0("thermolog:startup");

/**
 * Wraps up the server.listen callback method with a promise.
 *
 * @param server - Server to trigger 'listen' on
 * @param port - Port to listen on.
 * @returns Returns a promise that resolves upon completion.
 * @private
 */
function _listenPromise(server: http.Server, port: number): Promise<any> {
  return new Promise((resolve) => {
    const hostname = "::";
    const options = {
      host: hostname,
      port
    };
    server.listen(options, resolve);
  });
}

interface IHTTPServerError extends Error {
  syscall: string;
  code: string;
}

/**
 * Error event handler
 * @param error - Error to handle
 * @private
 */
function _onError(error: IHTTPServerError) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof(config.port) === "string"
    ? "Pipe " + config.port
    : "Port " + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Initializes the http server on the configured port.
 *
 * @param app - Middleware App
 * @returns {Promise} - Returns a promise that resolves upon server startup.
 */
export function initializeHttpServer(app: RequestListener) {

  debug("Starting HTTP Server");
  const httpServer = http.createServer(app);
  httpServer.on("error", _onError);

  return _listenPromise(httpServer, config.port)
    .then(() => (debug(`Started HTTP Server on ${config.port}`)))
    .then(() => (httpServer));
}
