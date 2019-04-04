/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules
const {SensorSubTypes} = require('./sensorTypes');

// Third party modules

/**
 * Report log object for a basic event.
 */
class Report {
  /**
   *
   * @param {CommonWeatherUpdate} weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate) {
    this.date = new Date();
    this.hubID = weatherUpdate.id;
    this.sensorID = weatherUpdate.sensor;
    this.barometric = parseFloat(weatherUpdate.baromin);
  }

  /**
   * @param {string} temperature - Temperature to save
   * @returns {Report} - Returns this
   */
  setTemperature(temperature) {
    this.temperature = parseFloat(temperature);
    return this;
  }

  /**
   * @param {string} humidity - Humidity to save
   * @returns {Report} - Returns this
   */
  setHumidity(humidity) {
    this.humidity = parseFloat(humidity);
    return this;
  }
}

/**
 * Report from a tower
 */
class TowerReport extends Report {
  /**
   * @param {TowerWeatherUpdate} weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate) {
    super(weatherUpdate);
    this.setTemperature(weatherUpdate.tempf);
    this.setHumidity(weatherUpdate.humidity);
  }
}

/**
 * Report from a ProIn sensor
 */
class ProReport extends Report {
  /**
   * @param {ProInWeatherUpdate} weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate) {
    super(weatherUpdate);
    this.setTemperature(weatherUpdate.indoortempf);
    this.setHumidity(weatherUpdate.indoorhumidity);
    this.waterIsPresent = weatherUpdate.water === '1';
  }
}

/**
 * Report from a five-in-one sensor
 */
class FiveInOneReport extends Report {
  /**
   * @param {FiveInOne38WeatherUpdate|FiveInOne31WeatherUpdate} weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate) {
    super(weatherUpdate);

    if (SensorSubTypes.fiveInOne31 === weatherUpdate.mt) {
      this.setWindSpeed(weatherUpdate.windspeedmph);
      this.rain = parseFloat(weatherUpdate.rainin);
      this.dailyRain = parseFloat(weatherUpdate.dailyrainin);
    } else {
      this.setTemperature(weatherUpdate.tempf);
      this.setHumidity(weatherUpdate.humidity);
      this.setWindSpeed(weatherUpdate.windspeedmph);
    }

  }

  /**
   * @param {string} windSpeed - Windspeed to save
   * @returns {FiveInOneReport} - Returns this.
   */
  setWindSpeed(windSpeed) {
    this.windSpeed = parseInt(windSpeed, 10);
    return this;
  }
}

module.exports = {
  Report,
  TowerReport,
  ProReport,
  FiveInOneReport
};
