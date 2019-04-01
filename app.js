/**
 * @file SP_NOCHECKIN //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const debug = require('debug')('thermolog:app');

const app = express();

// Setup CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

module.exports = app;
