/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules
const smartHubCache = require('../../services/smartHubCache');

// Third party modules
const express = require('express');
const router = express.Router();

router.get('/updateweatherstation', (req, res) => {
  console.log(JSON.stringify(req.query));
  smartHubCache.logWeatherStationUpdate(req.query);
  res.json();
});

module.exports = router;
