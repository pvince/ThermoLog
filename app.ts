/**
 * @file SP_NOCHECKIN //TODO_PTV: Update the description
 */

"use strict";

// NodeJS modules

// Our modules

// Third party modules
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

// Setup CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

export = app;
