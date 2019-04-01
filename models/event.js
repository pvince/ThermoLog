/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules

/**
 * Event log object for a basic event.
 */
class Event {
  /**
   *
   * @param {Date} date - Date the event occurred
   * @param {string} hubID - The HubID that received this event
   * @param {string} sensorID - The SensorID that generated the event
   * @param {number} temperature - The temperature the sensor reported
   * @param {number} humidity - The humidity the sensor reported
   * @param {number} barometric - The barometric pressure reported
   */
  constructor(date, hubID, sensorID, temperature, humidity, barometric) {
    this.date = date;
    this.hubID = hubID;
    this.sensorID = sensorID;
    this.temperature = temperature;
    this.humidity = humidity;
    this.barometric = barometric;
  }
}

module.exports = {
  Event
};
