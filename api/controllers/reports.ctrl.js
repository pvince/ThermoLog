/**
 * @file //TODO_PTV: Update the description
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
 *
 * @param context
 */
function getReportsBySensor(context) {
  const sensorID = _.get(context, 'params.path.sensorID', null);
  const result = hubCache.getEventsForSensor(sensorID);
  if (_.isNil(result)) {
    errorBuilder.buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find any events for a sensor with ID ${sensorID}`);
  } else {
    return result;
  }
}

module.exports = {
  getReportsBySensor
};
