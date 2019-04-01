/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules

/**
 *
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
}

module.exports = {
  Hub
};
