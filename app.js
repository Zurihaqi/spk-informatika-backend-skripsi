require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
// const logger = require("morgan");
// const open = require("open");
// const cors = require("cors");

// call all module route here
// const router = require("./server/routes/app.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(logger("combined"));
// app.use(cors());

module.exports = app;
