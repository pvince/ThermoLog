/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules
const httpStatus = require('http-status');
const _ = require('lodash');

/**
 * Constructs an error to return.
 *
 * @param {number} status - Status code to set on the error
 * @param {string} message - Message to return on the error.
 * @return {{message: *, status: *}} - Returns a new error object.
 */
function buildError(status, message) {
  return {
    status: status,
    message: message
  };
}

/**
 * Builds & sends an error.
 *
 * @param {exegesisContext} context - Context
 * @param {number} status - Status code to set on the error
 * @param {string} message - Message to return on the error.
 */
function buildAndSendError(context, status, message) {
  const err = {
    status: status,
    message: message
  };

  sendError(context.res, err);
}

/**
 *
 * @param {ServerResponse} res - Server response
 * @param {Error} error - Error to send
 */
function sendError(res, error) {
  const tempStatusCode = _.get(error, 'status', httpStatus.INTERNAL_SERVER_ERROR);

  Object.defineProperty(error, 'message', {enumerable: true});
  // *NOTE* This is a hack that was implemented to fix a problem where occasionally we get an error object
  //        where the statusCode is not only already defined, but it is frozen or otherwise defined as 'read-only'.
  //        Further, when this occurred the value was not serialized via JSON.stringify(...)
  Object.defineProperty(error, 'status', {enumerable: true, writeable: true, value: tempStatusCode});

  if (!res.headersSent) {
    res.setStatus(tempStatusCode);
    res.json(error);
  }
}

module.exports = {
  buildError,
  buildAndSendError,
  sendError
};
