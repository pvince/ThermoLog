/**
 * @file Data about hubs
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules

/**
 * Hub metadata
 */
class Hub {
  /**
   * @param {string} name - Name to use for this hub
   * @param {string} id - ID for this hub
   */
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.sensors = [];
  }

  /**
   * @param {string} sensorID - Sensor ID to ensure is part of this hub
   * @returns {Hub} - Returns this.
   */
  updateSensors(sensorID) {
    if (this.sensors.indexOf(sensorID) === -1) {
      this.sensors.push(sensorID);
    }
    return this;
  }
}

module.exports = {
  Hub
};
