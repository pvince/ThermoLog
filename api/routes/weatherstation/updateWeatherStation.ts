/**
 * @file This mocks out the Acurite API's "updateweatherstation" endpoint so we can gather data from smartHubs
 */

import express from "express";
import {logWeatherStationUpdate} from "../../services/smartHubCache";

const router = express.Router();

router.get("/updateweatherstation", (req, res) => {
  console.log(JSON.stringify(req.query));
  logWeatherStationUpdate(req.query);
  res.json();
});

export = router;
