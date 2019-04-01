/**
 * @file SP_NOCHECKIN //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules


// Our modules
const app = require('../app');
const exegesis = require('../api/api');
const startupFuncs = require('./serverFuncs');

// Third party modules
const debug = require('debug')('thermolog:server');
const _ = require('lodash');

// Register some common event handlers
process.on('uncaughtException', (err) => {
  console.error(`${(new Date).toUTCString()} uncaughtException: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason/*, promise*/) => {
  const message = _.get(reason, 'message', reason);
  const stack = _.get(reason, 'stack', reason);
  debug(`unhandled rejection: ${message}\n${stack}`);
});

// Let everyone know we are starting up
console.log('');
console.log('Initializing...');

// Kick off the startup process
exegesis.registerAPI()
  .then(() => startupFuncs.initializeHttpServer(app))
  .then(() => (console.log('Server running!')))
  .catch((err) => {
    const msg = _.get(err, 'message', 'Unknown message');
    const stack = _.get(err, 'stack', 'Unknown stack');
    const errMsg = `Failed to initialize ThermoLog server: ${msg}\n${stack}`;
    console.error(errMsg);
    debug(errMsg);
    process.exit(1);
  });
