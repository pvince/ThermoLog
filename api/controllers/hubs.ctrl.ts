/**
 * @file //TODO_PTV: Update the description
 */

// NodeJS modules

// Our modules

// Third party modules
import {ExegesisContext} from "exegesis-express";
import httpStatus from "http-status";
import _ from "lodash";

import {Hub} from "../../models/hub";
import {buildAndSendError} from "../helpers/errorBuilder";
import {getHub, updateHub} from "../services/smartHubCache";

/**
 * Controller for GET .../hubs/
 *
 * @return Returns a hub
 */
export {getHubs} from "../services/smartHubCache";

/**
 * Controller for GET .../hubs/{hubID}
 *
 * @param context - Exegesis Context
 * @return Returns a hub
 */
export function getHubByID(context: ExegesisContext): Hub {
  const hubID = _.get(context, "params.path.hubID", null);
  let result = null;
  if (_.isString(hubID) && !_.isEmpty(hubID)) {
    result = getHub(hubID);
  }

  if (_.isNil(result)) {
    buildAndSendError(context, httpStatus.NOT_FOUND, `Could not find hub with ID ${hubID}`);
  } else {
    return result;
  }

}

/**
 * Controller for PUT .../hubs/{hubID}. Updates the hub in cache.
 *
 * @param context - Exegesis Context
 * @return Returns a hub
 */
export function updateHubByID(context: ExegesisContext): Hub {
  const hub = getHubByID(context);
  if (!_.isNil(hub)) {
    const hubID = _.get(context, "params.path.hubID", hub.id);
    const hubParamID = _.get(hub, "id", "");

    const hubParam = _.get(context, "requestBody", {});

    if (hubParamID !== hubID) {
      buildAndSendError(context, httpStatus.BAD_REQUEST,
        `Provided object has ID ${hubParam.id} which does not match the hub ID ${hubID} for the hub being updated.`);
    } else {
      hub.name = _.get(hubParam, "name", hub.name);
      updateHub(hub);

      return hub;
    }
  }
}
