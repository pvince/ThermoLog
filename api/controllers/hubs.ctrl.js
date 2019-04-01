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
 * Controller for GET .../hubs
 *
 * param {exegesisContext} context - Exegesis Context
 * @return {Hub[]} - Returns an array of hubs
 */
function getHubs(/*context*/) {
  return hubCache.getHubs();
}

/**
 * Controller for GET .../hubs/{hubID}
 *
 * @param {exegesisContext} context - Exegesis Context
 * @return {Hub} - Returns a hub
 */
function getHubByID(context) {
  const hubID = _.get(context, 'params.path.hubID', null);
  let result = null;
  if (_.isString(hubID) && !_.isEmpty(hubID)) {
    result = hubCache.getHub(hubID);
  }

  if (_.isNil(result)) {
    errorBuilder.buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find hub with ID ${hubID}`);
  } else {
    return result;
  }

}

/**
 * Controller for PUT .../hubs/{hubID}. Updates the hub in cache.
 *
 * @param {exegesisContext} context - Exegesis Context
 * @return {Hub} - Returns a hub
 */
function updateHubByID(context) {
  const hub = getHubByID(context);
  if (!_.isNil(hub)) {
    const hubID = _.get(context, 'params.path.hubID', hub.id);
    const hubParamID = _.get(hub, 'id', '');

    const hubParam = _.get(context, 'requestBody', {});

    if (hubParamID !== hubID) {
      errorBuilder.buildAndSendError(context, httpStatus.BAD_REQUEST, `Provided object has ID ${hubParam.id} which does not match the hub ID ${hubID} for the hub being updated.`);
    } else {
      hub.name = _.get(hubParam, 'name', hub.name);
      hubCache.updateHub(hub);

      return hub;
    }
  }
}

module.exports = {
  getHubs,
  getHubByID,
  updateHubByID
};
