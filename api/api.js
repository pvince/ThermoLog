/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules
const path = require('path');

// Our modules
const app = require('../app');

// Third party modules
const exegesisExpress = require('exegesis-express');
const debug = require('debug')('thermolog:exegesis');

// Weatherstation Routes
const updateWeatherStation = require('./routes/weatherstation/updateWeatherStation');

/**
 * @typedef {object} exegesisParams
 * @property {object} query
 * @property {object} header
 * @property {object} path
 * @property {object} server
 * @property {object} cookie
 */

/**
 * @typedef {object} exegesisAPI
 * @property {object} openApiDoc
 * @property {object} serverObject
 * @property {object} serverPtr
 * @property {object} pathItemObject
 * @property {object} pathItemPath
 * @property {object} operationObject
 * @property {object} operationPtr
 * @property {object} requestBodyMediaTypeObj
 * @property {object} requestBodyMediaTypePtr
 */

/**
 * @typedef {object} exegesisContext
 * @property {IncomingMessage} req
 * @property {ServerResponse} res
 * @property {ServerResponse} origRes
 * @property {exegesisParams} params
 * @property {object} parameterLocations
 * @property {*} requestBody
 * @property {object} user
 * @property {exegesisAPI} api
 * @property {function} callback
 */

const INT_32_MAX = Math.pow(2, 32) - 1;
const INT_32_MIN = -1 * Math.pow(2, 32);

const INT_64_MIN = Number.MIN_SAFE_INTEGER;
const INT_64_MAX = Number.MAX_SAFE_INTEGER;

/**
 * Registers special methods used by the smartHUB API.
 * @private
 */
function _registerSmartHub() {
  debug('Registering smartHUB routes');
  app.use('/weatherstation', updateWeatherStation);
}

/**
 * Creates & registers the exegesis middleware.
 * @returns {Promise<Object>} - Returns a promise that resolves to the exegesisMiddleware
 */
function registerAPI() {
  const options = {
    controllers: path.resolve(__dirname, './controllers'),
    allowMissingControllers: false,
    autoHandleHttpErrors: true,
    customFormats: {
      int32: {
        type: 'number',
        validate: (value) => value >= INT_32_MIN && value <= INT_32_MAX
      },
      int64: {
        type: 'number',
        validate: (value) => value >= INT_64_MIN && value <= INT_64_MAX
      }
    }
  };

  _registerSmartHub();

  debug('Creating the exegesis middleware...');
  return exegesisExpress.middleware(
      path.resolve(__dirname, './spec/openapi.yaml'),
      options
    )
    .then((exegesisMW) => {
      app.use(exegesisMW);
      debug('Exegesis middleware created & registered.');

      return exegesisMW;
    });
}


module.exports = {
  registerAPI
};
