require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./server/routes/app.routes");
const logger = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());

app.use("/api", router);

module.exports = app;

//!SELF REMINDER! use FIS as middleware at route
