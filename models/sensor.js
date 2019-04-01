/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules
const SensorTypes = {
  tower: 'tower',
  fiveInOne38: '5N1x38',
  fiveInOne31: '5N1x31',
  proIn: 'ProIn'
};
Object.freeze(SensorTypes);

/**
 *
 */
class Sensor {
  /**
   * @param {string} hubID
   * @param {string} id
   * @param {SensorTypes} sensorType
   */
  constructor(hubID, id, sensorType) {
    this.hubID = hubID;
    this.id = id;
    this.sensorType = sensorType;
    this.name = '';
  }

  /**
   * Checks to see if this sensor matches the specified type.
   * @param type
   * @return {boolean}
   */
  isOfType(type) {
    return this.sensorType === type;
  }
}

module.exports = {
  Sensor
};
