/**
 * @file Provides methods for interacting with the configuration file.
 */

import debug0 from "debug";
import fs from "fs-extra";
import _ from "lodash";
import path from "path";

const debug = debug0("thermolog:config");
const CONFIG_PATH = path.resolve(__dirname, "../config.json");

let config = {
  port: 3000
};

/**
 * Initializes the configuration, this is synchronous.
 */
function initConfig() {
  try {
    const configText = fs.readFileSync(CONFIG_PATH, "utf8");
    config = JSON.parse(configText);
  } catch (err) {
    const msg = _.get(err, "message", "<unknown error message>");
    const stack = _.get(err, "stack", "<unknown error stack>");
    const errorMsg = `Failed to parse configuration: ${msg}\n${stack}`;
    console.error(errorMsg);
    debug(errorMsg);
  }

}

initConfig();

export = config;
