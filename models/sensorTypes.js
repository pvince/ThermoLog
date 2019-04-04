/**
 * @file Shared sensor 'types' file to help prevent circular references.
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules

const SensorSubTypes = {
  tower: 'tower',
  fiveInOne38: '5N1x38',
  fiveInOne31: '5N1x31',
  proIn: 'ProIn'
};
Object.freeze(SensorSubTypes);


const SensorTypes = {
  tower: 'tower',
  fiveInOne: 'fiveInOne',
  proIn: 'ProIn'
};
Object.freeze(SensorTypes);

module.exports = {
  SensorSubTypes,
  SensorTypes
};
