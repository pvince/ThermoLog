/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules
const {Hub} = require('../../models/hub');
const {Sensor} = require('../../models/sensor');
const {Event} = require('../../models/event');

// Third party modules
const _ = require('lodash');

/**
 * @typedef {Object} SensorCache
 * @property {Object.<string, Sensor>}
 */

/**
 * Cache of sensors, maps sensor.id :: sensor
 * @type {SensorCache}
 */
const sensorCache = {};

/**
 * @typedef {Object} HubCache
 * @property {Object.<string, Hub>}
 */

/**
 * Cache of hubs, maps hub.id :: hub
 * @type {HubCache}
 */
const hubCache = {};

/**
 * @typedef {object} EventLog
 * @property {Object.<string, Event[]>}
 */

/**
 * Log of all events, organized by sensor. Sensor.id :: Event[]
 * @type {EventLog}
 */
const eventLog = {};

/**
 * @typedef {object} WeatherStationUpdate
 * @property {string} dateutc - Always now?
 * @property {string} action - Always 'updateraw'?
 * @property {string} realtime - Always 1?
 * @property {string} id - HubID
 * @property {string} mt - Sensor type
 * @property {string} tempf - Temperature
 * @property {string} humidity - Humidity
 * @property {string} sensor - Sensor ID
 */

/**
 * Retrieves a hub from cache based on the Hub ID. If a hub is not found, it constructs a default one.
 *
 * @param {string} hubID - Hub ID
 * @return {Hub|null} - Returns the hub, or a newly created one otherwise
 */
function getHub(hubID) {
  return _.get(hubCache, hubID, null);
}

/**
 * @param {string} hubID - ID of the hub to retrieve.
 * @return {Hub} - Returns a cached hub, or creates one.
 * @private
 */
function _getOrCreateHub(hubID) {
  return getHub(hubID) || new Hub('', hubID);
}

/**
 * Stores the hub back into cache.
 *
 * @param {Hub} hub - Update a hub
 */
function updateHub(hub) {
  hubCache[hub.id] = hub;
}

/**
 * @param {string} id - Sensor ID
 * @return {Sensor} - Returns a sensor with that ID.
 */
function getSensor(id) {
  return _.get(sensorCache, id, null);
}

/**
 * @param {string} id - Sensor ID
 * @return {Sensor} - Returns a sensor with that ID.
 * @private
 */
function _getOrCreateSensor(id) {
  return getSensor(id) || new Sensor('', id, '');
}

/**
 * Stores // Updates a sensor in cache
 *
 * @param {Sensor} sensor - Sensor to store.
 */
function updateSensor(sensor) {
  sensorCache[sensor.id] = sensor;
}

/**
 * Adds an event to the log.
 *
 * @param {Event} event - Event to add to the log.
 */
function addEvent(event) {
  if (_.isNil(eventLog[event.sensorID])) {
    eventLog[event.sensorID] = [];
  }
  eventLog[event.sensorID].push(event);
}

/**
 * @return {Hub[]} - Returns a copy of all hubs stored in cache.
 */
function getHubs() {
  const result = [];
  _.forOwn(hubCache, (value) => {
    result.push(_.cloneDeep(value));
  });
  return result;
}

/**
 * Returns ALL events.
 * @param {string} sensorID - ID of the sensor to retrieve events for.
 * @return {Event[]} - Returns a copy of ALL events
 */
function getEventsForSensor(sensorID) {
  return _.cloneDeep(_.get(eventLog, sensorID, null));
}

/**
 * @return {Sensor[]} - Returns the full list of 'seen' sensors.
 */
function getSensors() {
  const result = [];
  _.forOwn(sensorCache, (value) => {
    result.push(_.cloneDeep(value));
  });
  return result;
}

/**
 *
 * @param {WeatherStationUpdate} update - Update data
 */
function logWeatherStationUpdate(update) {
  // Retrieve the current hub this update was from.
  const curHub = _getOrCreateHub(update.id);

  // Figure out the sensor information
  const curSensor = _getOrCreateSensor(update.sensor);
  if (_.isEmpty(curSensor.sensorType)) {
    curSensor.sensorType = update.mt;
    curSensor.hubID = update.id;
  }

  //date, hubID, sensorID, temperature, humidity, barometric
  // Log the event
  addEvent(new Event(new Date(), curHub.id, curSensor.id, parseFloat(update.tempf), parseFloat(update.humidity), parseFloat(update.baromin)));

  updateHub(curHub);
  updateSensor(curSensor);
}

module.exports = {
  logWeatherStationUpdate,
  getEventsForSensor,
  getSensor,
  getHub,
  updateHub,
  updateSensor,
  getSensors,
  getHubs
};
