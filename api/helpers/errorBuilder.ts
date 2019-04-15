/**
 * @file //TODO_PTV: Update the description
 */

// NodeJS modules

// Our modules

// Third party modules
import {ExegesisContext, ExegesisResponse} from "exegesis-express";
import httpStatus from "http-status";

import * as e from "express";
import { Response } from "express-serve-static-core";

import _ from "lodash";

interface IHTTPError extends Error {
  status: number;
  message: string;
}

/**
 * Constructs an error to return.
 *
 * @param {number} status - Status code to set on the error
 * @param {string} message - Message to return on the error.
 * @return Returns a new error object.
 */
export function buildError(status: number, message: string): IHTTPError {
  const resultErr = (new Error(message)) as IHTTPError;
  resultErr.status = status;
  return resultErr;
}

/**
 * Builds & sends an error.
 *
 * @param context - Context
 * @param status - Status code to set on the error
 * @param message - Message to return on the error.
 */
export function buildAndSendError(context: ExegesisContext, status: number, message: string) {
  const err = buildError(status, message);

  sendError(context.res, err);
}

/**
 * @param {ServerResponse} res - Server response
 * @param {Error} error - Error to send
 */
export function sendError(res: e.Response | ExegesisResponse, error: IHTTPError) {
  const tempStatusCode = _.get(error, "status", httpStatus.INTERNAL_SERVER_ERROR);

  Object.defineProperty(error, "message", {enumerable: true});
  // *NOTE* This is a hack that was implemented to fix a problem where occasionally we get an error object
  //        where the statusCode is not only already defined, but it is frozen or otherwise defined as 'read-only'.
  //        Further, when this occurred the value was not serialized via JSON.stringify(...)
  Object.defineProperty(error, "status", {enumerable: true, writable: true, value: tempStatusCode});

  res.statusCode = tempStatusCode;

  if (res instanceof Response) {
    // If this is a real 'response' object, we can be smart and check to see if the output has been returned to the
    // client already (meaning any attempt to set a status & json data is essentially moot)
    if (!(res as e.Response).headersSent) {
      (res as e.Response).status(tempStatusCode);
      res.json(error);
    }
  } else {
    res.json(error);
  }
}
