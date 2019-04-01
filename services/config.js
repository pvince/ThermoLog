/**
 * @file Provides methods for interacting with the configuration file.
 */

'use strict';

// NodeJS modules
const path = require('path');

// Our modules

// Third party modules
const fs = require('fs-extra');
const debug = require('debug')('thermolog:config');
const _ = require('lodash');

const CONFIG_PATH = path.resolve(__dirname, '../config.json');

let config = {
  port: 3000
};

/**
 * Initializes the configuration, this is synchronous.
 */
function initConfig() {
  try {
    const configText = fs.readFileSync(CONFIG_PATH, 'utf8');
    config = JSON.parse(configText);
  } catch (err) {
    const msg = _.get(err, 'message', '<unknown error message>');
    const stack = _.get(err, 'stack', '<unknown error stack>');
    const errorMsg = `Failed to parse configuration: ${msg}\n${stack}`;
    console.error(errorMsg);
    debug(errorMsg);
  }

}

initConfig();

module.exports = config;
