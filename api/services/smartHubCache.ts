/**
 * @file Central cache for all data that has been collected from smartHubs
 */

import {Hub} from "../../models/hub";
import {Report} from "../../models/report";
import {CreateSensor, ICommonWeatherUpdate, Sensor} from "../../models/sensor";

// Third party modules
import _ from "lodash";
import {getSpecificTypeFromString} from "../../models/sensorTypes";

interface ISensorCache {
  [key: string]: Sensor;
}

interface IHubCache {
  [key: string]: Hub;
}

interface IReportCache {
  [key: string]: Report[];
}

/**
 * Cache of sensors, maps sensor.id :: sensor
 */
const sensorCache: ISensorCache = {};

/**
 * Cache of hubs, maps hub.id :: hub
 */
const hubCache: IHubCache = {};

/**
 * Log of all events, organized by sensor. Sensor.id :: Report[]
 */
const eventLog: IReportCache = {};

/**
 * Retrieves a hub from cache based on the Hub ID. If a hub is not found, it constructs a default one.
 *
 * @param hubID - Hub ID
 * @return Returns the hub, or a newly created one otherwise
 */
export function getHub(hubID: string): Hub | null {
  return _.get(hubCache, hubID, null);
}

/**
 * @param hubID - ID of the hub to retrieve.
 * @return  Returns a cached hub, or creates one.
 * @private
 */
function _getOrCreateHub(hubID: string): Hub {
  return getHub(hubID) || new Hub("", hubID);
}

/**
 * Stores the hub back into cache.
 *
 * @param hub - Update a hub
 */
export function updateHub(hub: Hub) {
  hubCache[hub.id] = hub;
}

/**
 * @param id - Sensor ID
 * @return Returns a sensor with that ID if it exists in cache, null otherwise.
 */
export function getSensor(id: string): Sensor | null {
  return _.get(sensorCache, id, null);
}

/**
 * Checks cache for a sensor with the specified ID, if one is not found it creates a new one of the specified type.
 *
 * @param id - Sensor ID
 * @param typeStr - Sensor type as a string
 * @return Returns a sensor with that ID.
 * @private
 */
function _getOrCreateSensor(id: string, typeStr: string) {
  const specificType = getSpecificTypeFromString(typeStr);
  return getSensor(id) || CreateSensor(specificType).setID(id);
}

/**
 * Stores // Updates a sensor in cache
 *
 * @param sensor - Sensor to store.
 */
export function updateSensor(sensor: Sensor) {
  sensorCache[sensor.id] = sensor;
}

/**
 * Adds a report from a sensor to the log.
 *
 * @param {Report} report - Report to add to the log.
 */
export function addReport(report: Report) {
  if (_.isNil(eventLog[report.sensorID])) {
    eventLog[report.sensorID] = [];
  }
  eventLog[report.sensorID].push(report);
}

/**
 * @return Returns a copy of all hubs stored in cache.
 */
export function getHubs(): Hub[] {
  const result: Hub[] = [];
  _.forOwn(hubCache, (value) => {
    result.push(_.cloneDeep(value));
  });
  return result;
}

/**
 * Returns ALL events.
 * @param {string} sensorID - ID of the sensor to retrieve events for.
 * @return {Report[]} - Returns a copy of ALL events
 */
export function getEventsForSensor(sensorID: string): Report[] {
  return _.cloneDeep(_.get(eventLog, sensorID, null));
}

/**
 * @return Returns the full list of 'seen' sensors.
 */
export function getSensors(): Sensor[] {
  const result: Sensor[] = [];
  _.forOwn(sensorCache, (value) => {
    result.push(_.cloneDeep(value));
  });
  return result;
}

/**
 * Processes a 'weatherUpdate' received from us intercepting Acurite smartHUB API updates.
 *
 * @param update - Update data sent from a smartHub to 'updateweatherstation'
 */
export function logWeatherStationUpdate(update: ICommonWeatherUpdate) {
  // Retrieve the current hub this update was from.
  const curHub = _getOrCreateHub(update.id).updateSensors(update.sensor);

  // Figure out the sensor information
  const curSensor = _getOrCreateSensor(update.sensor, update.mt).initFromWeatherUpdate(update);

  // date, hubID, sensorID, temperature, humidity, barometric
  // Log the event
  addReport(curSensor.initReportFromWeatherUpdate(update));

  updateHub(curHub);
  updateSensor(curSensor);
}
