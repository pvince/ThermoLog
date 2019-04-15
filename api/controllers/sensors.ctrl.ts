/**
 * @file Controllers for updating sensors.
 */

import {ExegesisContext} from "exegesis-express";
import httpStatus from "http-status";
import _ from "lodash";

// Our modules
import {Sensor} from "../../models/sensor";
import {buildAndSendError} from "../helpers/errorBuilder";
import {getSensor, updateSensor} from "../services/smartHubCache";

/**
 * Controller for GET ./sensors
 *
 * @return {Sensor[]} - Returns an array of sensors
 */
export {getSensors} from "../services/smartHubCache";

/**
 * Controller for GET ./sensors/{sensorID}
 *
 * @param context - Request context
 * @return Returns a sensor specified by the ID.
 */
export function getSensorByID(context: ExegesisContext): Sensor {
  const sensorID = _.get(context, "params.path.sensorID", null);
  const result = getSensor(sensorID);

  if (_.isNil(result)) {
    buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find hub with ID ${sensorID}`);
  } else {
    return result;
  }
}

/**
 * Controller for PUT ./sensors/{sensorID}
 *
 * @param context - Request context
 * @return Returns the sensor that was updated.
 */
export function updateSensorByID(context: ExegesisContext): Sensor {
  // Retrieve information from the request
  const sensorID = _.get(context, "params.path.sensorID", null);
  const sensorUpdate = _.get(context, "requestBody", {});

  const sensorCache = getSensorByID(context);
  const sensorIDUpdate = _.get(sensorUpdate, "id", sensorCache.id);

  // Verify a sensor actually exists with the ID they are trying to update
  if (!_.isNil(sensorCache)) {
    // Verify that IF they gave us an ID, it matches the cached sensors ID
    if (sensorIDUpdate === sensorID) {
      // Only thing a caller can update is the 'name', so merge that data into the cached sensor
      sensorCache.name = _.get(sensorUpdate, "name", sensorCache.name);
      updateSensor(sensorCache);

      return sensorCache;
    } else {
      buildAndSendError(context, httpStatus.BAD_REQUEST,
          `ID mismatch. Provided sensor has an ID of ${sensorIDUpdate} however the endpoint for a sensor with ID ${sensorID} was used.`);
    }
  }
}
