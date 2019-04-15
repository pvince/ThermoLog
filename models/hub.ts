/**
 * @file Data about hubs
 */

// NodeJS modules

// Our modules

// Third party modules

/**
 * Hub metadata
 */
export class Hub {
  public name: string;
  public id: string;
  public sensors: string[];

  /**
   * @param name - Name to use for this hub
   * @param id - ID for this hub
   */
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.sensors = [];
  }

  /**
   * @param sensorID - Sensor ID to ensure is part of this hub
   * @returns Returns this.
   */
  public updateSensors(sensorID: string): Hub {
    if (this.sensors.indexOf(sensorID) === -1) {
      this.sensors.push(sensorID);
    }
    return this;
  }
}
