/* tslint:disable:max-classes-per-file */
/**
 * @file //TODO_PTV: Update the description
 */

// NodeJS modules

// Our modules

// Third party modules
import _ from "lodash";

import {FiveInOneReport, ProReport, Report, TowerReport} from "./report";
import { convertSpecificToGeneralType, getSpecificTypeFromString, SensorGeneralTypes, SensorSpecificTypes} from "./sensorTypes";

/**
 * Common values we will receive from a 'weather update' originating from a SensorHub
 */
export interface ICommonWeatherUpdate {
  /**
   * Always now?
   */
  dateutc: string;
  /**
   * Always 'updateraw'?
   */
  action: string;
  /**
   * Always 1?
   */
  realtime: string;
  /**
   * HubID, ex: AEB123512
   */
  id: string;
  /**
   * Sensor type, ex: tower
   */
  mt: string;
  /**
   * Sensor ID, ex: 00001234
   */
  sensor: string;
  /**
   * Battery string, normal // low
   */
  battery: string;
  /**
   * Barometric pressure, ex: 30.17
   */
  baromin: string;
  /**
   * Signal strength, 1-4
   */
  rssi: string;
}

/**
 * Weather update from a 'tower' sensor
 */
export interface ITowerWeatherUpdate extends ICommonWeatherUpdate {
  /**
   * Temperature, ex: 40.2
   */
  tempf: string;
  /**
   * Humidity, ex: 54
   */
  humidity: string;
}

/**
 * Weather update from a 'ProIn' sensor
 */
export interface IProInWeatherUpdate extends ICommonWeatherUpdate {
  /**
   * Temperature, ex: 40.2
   */
  indoortempf: string;
  /**
   * Humidity, ex: 54
   */
  indoorhumidity: string;
  /**
   * Equals 1? (Currently only have a water probe)
   */
  probe: string;
  /**
   * Equals 0?
   */
  check: string;
  /**
   * 1 == water, 0 == no water
   */
  water: string;
}

/**
 * Weather update from a FiveInOne38 sensor.
 */
export interface IFiveInOne38WeatherUpdate extends ICommonWeatherUpdate {
  /**
   * Temperature, ex: 40.2
   */
  tempf: string;
  /**
   * Humidity, ex: 54
   */
  humidity: string;
  windspeedmph: string;
}

/**
 * Weather update from a FiveInOne31 sensor.
 */
export interface IFiveInOne31WeatherUpdate extends ICommonWeatherUpdate {
  windspeedmph: string;
  /**
   * Degrees, 0-360
   */
  winddir: string;
  /**
   * 0.00
   */
  rainin: string;
  /**
   * 0.00
   */
  dailyrainin: string;
}

/**
 * Sensors can report to multiple hubs, this is information about a sensor that is tied to a hub. Ex: How strongly the
 * hub received the signal and how long has it been since the hub last saw the sensor.
 */
export interface ISensorHub {
  /**
   * ID of the hub
   */
  id: string;
  /**
   * Signal strength of the sensor at this hub.
   */
  signal?: number;
  /**
   * The last time this hub received a signal from the sensor.
   */
  lastContact?: Date;
}

/**
 *
 */
export class Sensor {
  public id: string;
  public type: SensorGeneralTypes;
  public subTypes: SensorSpecificTypes[];
  public name: string;
  public hubs: ISensorHub[];
  public battery: string;

  /**
   * Base constructor, use 'initFromReport'
   */
  constructor() {
    this.id = "";
    this.type = SensorGeneralTypes.unknown;
    this.subTypes = [];
    this.name = "";
    this.hubs = [];
    this.battery = "";
  }

  /**
   * Initializes this sensor based on received data.
   *
   * @param  weatherUpdate - Sensor report received.
   * @returns Returns 'this', the initialized sensor.
   */
  public initFromWeatherUpdate(weatherUpdate: ICommonWeatherUpdate): Sensor {
    this.id = weatherUpdate.sensor;
    this.updateSubTypes(getSpecificTypeFromString(weatherUpdate.mt));
    this.setHub(weatherUpdate.id, parseInt(weatherUpdate.rssi, 10));
    this.setBattery(weatherUpdate.battery);

    return this;
  }

  /**
   * Base implementation for initializing a report.
   *
   * @param weatherUpdate - Weather update object
   * @returns Returns a new report
   */
  public initReportFromWeatherUpdate(weatherUpdate: ICommonWeatherUpdate): Report {
    return new Report(weatherUpdate);
  }

  /**
   * @param id - ID to set on the sensor
   * @returns  Returns this.
   */
  public setID(id: string): Sensor {
    this.id = id;
    return this;
  }

  /**
   * Updates the 'subtypes' for a sensor.
   * @param specificType - Sensor subtype
   * @returns Returns this.
   */
  public updateSubTypes(specificType: SensorSpecificTypes): Sensor {
    this.type = convertSpecificToGeneralType(specificType);

    // TODO: This is a total hack, should find a better way to filter sub-types
    if (this.type === SensorGeneralTypes.fiveInOne) {
      const subType = this.subTypes.find((value) => value === specificType);
      if (_.isNil(subType)) {
        this.subTypes.push(specificType);
      }
    }
    return this;
  }

  /**
   * Attempts to retrieve SensorHub information about a particular hub from this sensor.
   *
   * @param hubID - ID of the hub to retrieve.
   * @return Either returns the hub, or null if no hub is associated with this sensor yet.
   */
  public getHub(hubID: string): ISensorHub | null {
    return this.hubs.find((hub) => (hub.id === hubID)) || null;
  }

  /**
   * Updates this sensor with information from a hub.
   *
   * @param hubID - ID of the hub this information belongs to
   * @param signalStrength - The strength of the signal from this sensor at the hub
   * @return Returns a reference to 'this' for function chaining.
   */
  public setHub(hubID: string, signalStrength: number): Sensor {
    let hub = this.getHub(hubID);
    if (_.isNil(hub)) {
      hub = { id: hubID };
      this.hubs.push(hub);
    }
    hub.signal = signalStrength;
    hub.lastContact = new Date();

    return this;
  }

  /**
   * Updates the battery life for this sensor.
   *
   * @param battery - New battery life for this sensor.
   * @return Reference to 'this'
   */
  public setBattery(battery: string): Sensor {
    this.battery = battery;
    return this;
  }
}

/**
 * Specific implementation of a 'tower' sensor.
 */
export class TowerSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param weatherUpdate - Weather update object
   * @returns Returns a new event
   */
  public initReportFromWeatherUpdate(weatherUpdate: ITowerWeatherUpdate): TowerReport {
    return new TowerReport(weatherUpdate);
  }
}

/**
 * Specific implementation of a 'Pro' sensor.
 */
export class ProSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param weatherUpdate - Weather update object
   * @returns Returns a new event
   */
  public initReportFromWeatherUpdate(weatherUpdate: IProInWeatherUpdate): ProReport {
    return new ProReport(weatherUpdate);
  }
}

/**
 * Specific implementation of a 'FiveInOne' sensor.
 */
export class FiveInOneSensor extends Sensor {
  /**
   * Base implementation for initializing a report.
   *
   * @param weatherUpdate - Weather update object
   * @returns - Returns a new event
   */
  public initReportFromWeatherUpdate(weatherUpdate: IFiveInOne31WeatherUpdate | IFiveInOne38WeatherUpdate): FiveInOneReport {
    return new FiveInOneReport(weatherUpdate);
  }
}

/**
 * Creates a sensor that matches the specified sub-type.
 * @param {string} sensorSubType - Sub-type
 * @returns {Sensor} - A new sensor of the appropriate type.
 * @constructor
 */
export function CreateSensor(sensorSubType: string): Sensor {
  const sensorType = convertSpecificToGeneralType(getSpecificTypeFromString(sensorSubType));
  if (sensorType === SensorGeneralTypes.tower) {
    return new TowerSensor();
  } else if (sensorType === SensorGeneralTypes.proIn) {
    return new ProSensor();
  } else if (sensorType === SensorGeneralTypes.fiveInOne) {
    return new FiveInOneSensor();
  } else {
    return new Sensor();
  }
}
