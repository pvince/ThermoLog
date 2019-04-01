/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules
const http = require('http');

// Our modules
const config = require('../services/config');

// Third party modules
const debug = require('debug')('thermolog:startup');
const _ = require('lodash');

/**
 * Wraps up the server.listen callback method with a promise.
 *
 * @param {Server} server - Server to trigger 'listen' on
 * @param {number} port - Port to listen on.
 * @returns {Promise} - Returns a promise that resolves upon completion.
 * @private
 */
function _listenPromise(server, port) {
  return new Promise((resolve, reject) => {
    server.listen(port, '::', (error) => {
      if (!_.isNil(error)) {
        return reject(error);
      }
      return resolve();
    });
  });
}

/**
 * Error event handler
 * @param {Error} error - Error to handle
 * @private
 */
function _onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + config.port
    : 'Port ' + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Initializes the http server on the configured port.
 *
 * @param {Object} app - Middleware App
 * @returns {Promise} - Returns a promise that resolves upon server startup.
 */
function initializeHttpServer(app) {
  debug('Starting HTTP Server');
  const httpServer = http.createServer(app);
  httpServer.on('error', _onError);

  return _listenPromise(httpServer, config.port)
    .then(() => (debug(`Started HTTP Server on ${config.port}`)))
    .then(() => (httpServer));
}

module.exports = {
  initializeHttpServer
};
