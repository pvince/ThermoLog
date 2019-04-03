/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

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
   *
   * @param {string} sensorSubType
   * @return {string}
   */
  static getSensorTypeFromSubtype(sensorSubType) {
    if ([SensorSubTypes.fiveInOne31, SensorSubTypes.fiveInOne38].includes(sensorSubType)) {
      return SensorTypes.fiveInOne;
    }
    return sensorSubType;
  }

  /**
   * @param {string} hubID - The Hub ID
   * @param {string} id - The sensor ID
   */
  constructor(hubID, id) {
    this.id = id;
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

module.exports = {
  Sensor
};
