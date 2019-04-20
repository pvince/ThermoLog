/* tslint:disable */
/**
 * @file //TODO_PTV: Update the description
 */

// NodeJS modules

// Our modules
import {
  convertSpecificToGeneralType,
  getSpecificTypeFromString,
  SensorGeneralTypes,
  SensorSpecificTypes
} from './sensorTypes';

import {
  ICommonWeatherUpdate,
  IFiveInOne31WeatherUpdate,
  IFiveInOne38WeatherUpdate,
  IProInWeatherUpdate,
  ITowerWeatherUpdate
} from './sensor';

// Third party modules

/**
 * Report log object for a basic event.
 */
export class Report {
  public date: Date;
  public hubID: string;
  public sensorID: string;
  public barometric: number;
  public type: SensorGeneralTypes;
  public temperature: number;
  public humidity: number;
  /**
   *
   * @param weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate: ICommonWeatherUpdate) {
    this.date = new Date();
    this.hubID = weatherUpdate.id;
    this.sensorID = weatherUpdate.sensor;
    this.barometric = parseFloat(weatherUpdate.baromin);
    this.type = convertSpecificToGeneralType(getSpecificTypeFromString(weatherUpdate.mt));
  }

  /**
   * @param temperature - Temperature to save
   * @returns - Returns this
   */
  public setTemperature(temperature: string): Report {
    this.temperature = parseFloat(temperature);
    return this;
  }

  /**
   * @param {string} humidity - Humidity to save
   * @returns {Report} - Returns this
   */
  public setHumidity(humidity: string): Report {
    this.humidity = parseFloat(humidity);
    return this;
  }
}

/**
 * Report from a tower
 */
export class TowerReport extends Report {
  /**
   * @param weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate: ITowerWeatherUpdate) {
    super(weatherUpdate);
    this.setTemperature(weatherUpdate.tempf);
    this.setHumidity(weatherUpdate.humidity);
  }
}

/**
 * Report from a ProIn sensor
 */
export class ProReport extends Report {
  public waterIsPresent: boolean;

  /**
   * @param weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate: IProInWeatherUpdate) {
    super(weatherUpdate);
    this.setTemperature(weatherUpdate.indoortempf);
    this.setHumidity(weatherUpdate.indoorhumidity);
    this.waterIsPresent = weatherUpdate.water === '1';
  }
}

/**
 * Report from a five-in-one sensor
 */
export class FiveInOneReport extends Report {
  public rain: number;
  public dailyRain: number;
  public windDir: number;
  public windSpeed: number;

  /**
   * @param weatherUpdate - weather update received from a hub.
   */
  constructor(weatherUpdate: IFiveInOne38WeatherUpdate | IFiveInOne31WeatherUpdate) {
    super(weatherUpdate);
    const specificType = getSpecificTypeFromString(weatherUpdate.mt);

    if (SensorSpecificTypes.fiveInOne31 === specificType) {
      // We know this is a 5N1x31 weather report, which means we should have wind & rain data.
      const fiveInOne31WeatherUpdate = <IFiveInOne31WeatherUpdate>weatherUpdate;

      this.setWindSpeed(weatherUpdate.windspeedmph);
      this.rain = parseFloat(fiveInOne31WeatherUpdate.rainin);
      this.dailyRain = parseFloat(fiveInOne31WeatherUpdate.dailyrainin);
      this.windDir = parseInt(fiveInOne31WeatherUpdate.winddir, 10);
    } else {
      // We know the only other option is a 5n1x38 weather report which contains temperature, humidity, and wind speed.
      const fiveInOne38WeatherUpdate = <IFiveInOne38WeatherUpdate>weatherUpdate;

      this.setTemperature(fiveInOne38WeatherUpdate.tempf);
      this.setHumidity(fiveInOne38WeatherUpdate.humidity);
      this.setWindSpeed(fiveInOne38WeatherUpdate.windspeedmph);
    }

  }

  /**
   * @param windSpeed - Wind speed to save
   * @returns Returns this.
   */
  setWindSpeed(windSpeed: string): FiveInOneReport {
    this.windSpeed = parseInt(windSpeed, 10);
    return this;
  }
}
