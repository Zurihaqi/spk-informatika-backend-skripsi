require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./server/routes/app.routes");
const logger = require("morgan");
const cors = require("cors");
var path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/script-adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.use("/api", router);

module.exports = app;

//!SELF REMINDER! use FIS as middleware at route
