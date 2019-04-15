/**
 * @file //TODO_PTV: Update the description
 */

// Third party modules
import {ExegesisContext} from "exegesis-express";
import httpStatus from "http-status";
import _ from "lodash";

// NodeJS modules

// Our modules
import {Report} from "../../models/report";
import {buildAndSendError} from "../helpers/errorBuilder";
import {getEventsForSensor} from "../services/smartHubCache";

/**
 *
 * @param context
 */
export function getReportsBySensor(context: ExegesisContext): Report[] {
  const sensorID = _.get(context, "params.path.sensorID", null);
  const result = getEventsForSensor(sensorID);
  if (_.isNil(result)) {
    buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find any events for a sensor with ID ${sensorID}`);
  } else {
    return result;
  }
}
