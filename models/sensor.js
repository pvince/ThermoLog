/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules
const { Report } = require('./report');

// Third party modules
const _ = require('lodash');

const SensorSubTypes = {
  tower: 'tower',
  fiveInOne38: '5N1x38',
  fiveInOne31: '5N1x31',
  proIn: 'ProIn'
};
Object.freeze(SensorSubTypes);


const SensorTypes = {
  tower: 'tower',
  fiveInOne: 'fiveInOne',
  proIn: 'ProIn'
};
Object.freeze(SensorTypes);

/**
 * @typedef {object} CommonWeatherUpdate
 * @property {string} dateutc - Always now?
 * @property {string} action - Always 'updateraw'?
 * @property {string} realtime - Always 1?
 * @property {string} id - HubID
 * @property {string} mt - Sensor type
 * @property {string} sensor - Sensor ID
 * @property {string} battery - normal // low
 * @property {string} baromin - baromin, ex: 30.17
 * @property {string} rssi - Signal strength, 1-4
 */

/**
 * @typedef {CommonWeatherUpdate} TowerWeatherUpdate
 * @property {string} tempf - Temperature, ex: 40.2
 * @property {string} humidity - Humidity, ex: 54
 */

/**
 * @typedef {CommonWeatherUpdate} ProInWeatherUpdate
 * @property {string} indoortempf - Temperature, ex: 40.2
 * @property {string} indoorhumidity - Humidity, ex: 54
 * @property {string} probe - Equals 1?
 * @property {string} check - Equals 0?
 * @property {string} water - Equals 0 or 1
 */

/**
 * @typedef {CommonWeatherUpdate} FiveInOne38WeatherUpdate
 * @property {string} tempf - Temperature, ex: 40.2
 * @property {string} humidity - Humidity, ex: 54
 * @property {string} windspeedmph - Wind speed mph
 */

/**
 * @typedef {CommonWeatherUpdate} FiveInOne31WeatherUpdate
 * @property {string} windspeedmph - Wind speed mph
 * @property {string} winddir - Degrees, 0-360
 * @property {string} rainin - 0.00
 * @property {string} dailyrainin - 0.00
 */

/**
 * @typedef {object} SensorHub
 * @property {string} id - ID of the hub
 * @property {number} signal - Signal strength of the sensor at this hub.
 * @property {date} lastContact - The last time this hub received a signal from the sensor.
 */

/**
 *
 */
class Sensor {
  /**
   * Static: Returns sensor type from the sub-type.
   *
   * @param {string} sensorSubType - Sensor sub-type
   * @return {string} - Returns the sensor type
   */
  static getSensorTypeFromSubtype(sensorSubType) {
    if ([SensorSubTypes.fiveInOne31, SensorSubTypes.fiveInOne38].includes(sensorSubType)) {
      return SensorTypes.fiveInOne;
    }
    return sensorSubType;
  }

  /**
   * Initializes this sensor
   * @param {CommonWeatherUpdate} weatherUpdate - Sensor report received.
   * @returns {Sensor} - Returns 'this' the initialized sensor.
   */
  initFromWeatherUpdate(weatherUpdate) {
    this.id = weatherUpdate.sensor;
    this.updateSubTypes(weatherUpdate.mt);
    this.setHub(weatherUpdate.id, parseInt(weatherUpdate.rssi, 10));
    this.setBattery(weatherUpdate.battery);

    return this;
  }

  /**
   * Base implementation for initializing a report.
   *
   * @param {CommonWeatherUpdate} weatherUpdate - Weather update object
   * @returns {Report} - Returns a new event
   */
  initReportFromWeatherUpdate(weatherUpdate) {
    return new Report(new Date(), weatherUpdate.id, weatherUpdate.sensor, 0, 0, 0);
  }

  /**
   * Base constructor, use 'initFromReport'
   */
  constructor() {
    this.id = '';
    this.type = '';
    /**
     * @type {string[]}
     */
    this.subTypes = [];
    this.name = '';
    /**
     * @type {SensorHub[]}
     */
    this.hubs = [];
    this.battery = '';
  }

  /**
   * @param {string} id - ID to set on the sensor
   * @returns {Sensor} - Returns this.
   */
  setID(id) {
    this.id = id;
    return this;
  }

  /**
   * Updates the 'subtypes' for a sensor.
   * @param {string} subType - Sensor subtype
   * @returns {Sensor} - Returns this.
   */
  updateSubTypes(subType) {
    this.type = Sensor.getSensorTypeFromSubtype(subType);

    // TODO: This is a total hack, should find a better way to filter sub-types
    if (this.type === SensorTypes.fiveInOne) {
      const _subType = this.subTypes.find((value) => value === subType);
      if (_.isNil(_subType)) {
        this.subTypes.push(subType);
      }
    }
    return this;
  }

  /**
   * Attempts to retrieve SensorHub information about a particular hub from this sensor.
   *
   * @param {string} hubID - ID of the hub to retrieve.
   * @return {SensorHub|null} - Either returns the hub, or null if no hub is associated with this sensor yet.
   */
  getHub(hubID) {
    return this.hubs.find((hub) => (hub.id === hubID)) || null;
  }

  /**
   * Updates this sensor with information from a hub.
   *
   * @param {string} hubID - ID of the hub this information belongs to
   * @param {number} signalStrength - The strength of the signal from this sensor at the hub
   * @return {Sensor} - Returns a reference to 'this' for function chaining.
   */
  setHub(hubID, signalStrength) {
    let hub = this.getHub(hubID);
    if (_.isNil(hub)) {
      hub = { id: hubID};
      this.hubs.push(hub);
    }
    hub.signal = signalStrength;
    hub.lastContact = new Date();

    return this;
  }

  /**
   * Updates the battery life for this sensor.
   *
   * @param {string} battery - New battery life for this sensor.
   * @return {Sensor} - Reference to 'this'
   */
  setBattery(battery) {
    this.battery = battery;
    return this;
  }
}

/**
 * Specific implementation of a 'tower' sensor.
 */
class TowerSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param {TowerWeatherUpdate} weatherUpdate - Weather update object
   * @returns {Report} - Returns a new event
   */
  initReportFromWeatherUpdate(weatherUpdate) {
    return new Report(new Date(), weatherUpdate.id, weatherUpdate.sensor, parseFloat(weatherUpdate.tempf),
      parseFloat(weatherUpdate.humidity), parseFloat(weatherUpdate.baromin));
  }
}

/**
 * Specific implementation of a 'Pro' sensor.
 */
class ProSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param {ProInWeatherUpdate} weatherUpdate - Weather update object
   * @returns {Report} - Returns a new event
   */
  initReportFromWeatherUpdate(weatherUpdate) {
    return new Report(new Date(), weatherUpdate.id, weatherUpdate.sensor, parseFloat(weatherUpdate.indoortempf),
      parseFloat(weatherUpdate.indoorhumidity), parseFloat(weatherUpdate.baromin));
  }
}

/**
 * Specific implementation of a 'FiveInOne' sensor.
 */
class FiveInOneSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param {FiveInOne38WeatherUpdate|FiveInOne31WeatherUpdate} weatherUpdate - Weather update object
   * @returns {Report} - Returns a new event
   */
  initReportFromWeatherUpdate(weatherUpdate) {
    if (weatherUpdate.mt === SensorSubTypes.fiveInOne31) {
      return new Report(new Date(), weatherUpdate.id, weatherUpdate.sensor, 0, 0, parseFloat(weatherUpdate.baromin));
    } else {
      return new Report(new Date(), weatherUpdate.id, weatherUpdate.sensor, parseFloat(weatherUpdate.tempf),
        parseFloat(weatherUpdate.humidity), parseFloat(weatherUpdate.baromin));
    }
  }
}

/**
 * Creates a sensor that matches the specified sub-type.
 * @param {string} sensorSubType - Sub-type
 * @returns {Sensor} - A new sensor of the appropriate type.
 * @constructor
 */
function CreateSensor(sensorSubType) {
  const sensorType = Sensor.getSensorTypeFromSubtype(sensorSubType);
  if (sensorType === SensorTypes.tower) {
    return new TowerSensor();
  } else if (sensorType === SensorTypes.proIn) {
    return new ProSensor();
  } else if (sensorType === SensorTypes.fiveInOne) {
    return new FiveInOneSensor();
  } else {
    return new Sensor();
  }
}

module.exports = {
  Sensor,
  TowerSensor,
  ProSensor,
  FiveInOneSensor,
  CreateSensor
};
