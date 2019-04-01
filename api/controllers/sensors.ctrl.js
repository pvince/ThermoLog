/**
 * @file Controllers for updating sensors.
 */

'use strict';

// NodeJS modules

// Our modules
const hubCache = require('../services/smartHubCache');
const errorBuilder = require('../helpers/errorBuilder');

// Third party modules
const _ = require('lodash');
const httpStatus = require('http-status');

/**
 * Controller for GET ./sensors
 *
 * @return {Sensor[]} - Returns an array of sensors
 */
function getSensors(/*context*/) {
  return hubCache.getSensors();
}

/**
 * Controller for GET ./sensors/{sensorID}
 *
 * @param {exegesisContext} context - Request context
 * @return {Sensor} - Returns a sensor specified by the ID.
 */
function getSensorByID(context) {
  const sensorID = _.get(context, 'params.path.sensorID', null);
  const result = hubCache.getSensor(sensorID);

  if (_.isNil(result)) {
    errorBuilder.buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find hub with ID ${sensorID}`);
  } else {
    return result;
  }
}

/**
 * Controller for PUT ./sensors/{sensorID}
 *
 * @param {exegesisContext} context - Request context
 * @return {Sensor} - Returns the sensor that was updated.
 */
function updateSensorByID(context) {
  // Retrieve information from the request
  const sensorID = _.get(context, 'params.path.sensorID', null);
  const sensorUpdate = _.get(context, 'requestBody', {});

  const sensorCache = getSensorByID(context);
  const sensorIDUpdate = _.get(sensorUpdate, 'id', sensorCache.id);


  // Verify a sensor actually exists with the ID they are trying to update
  if (!_.isNil(sensorCache)) {
    // Verify that IF they gave us an ID, it matches the cached sensors ID
    if (sensorIDUpdate === sensorID) {
      // Only thing a caller can update is the 'name', so merge that data into the cached sensor
      sensorCache.name = _.get(sensorUpdate, 'name', sensorCache.name);
      hubCache.updateSensor(sensorCache);

      return sensorCache;
    } else {
      errorBuilder.buildAndSendError(context, httpStatus.BAD_REQUEST, `ID mismatch. Provided sensor has an ID of ${sensorIDUpdate} however the endpoint for a sensor with ID ${sensorID} was used.`);
    }
  }
}

module.exports = {
  getSensors,
  getSensorByID,
  updateSensorByID
};
