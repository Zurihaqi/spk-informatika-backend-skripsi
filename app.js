require("dotenv").config();
require("pg");
const express = require("express");
const app = express();
const router = require("./server/routes/app.routes");
const logger = require("morgan");
const cors = require("cors");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(logger("dev"));
app.use(cors());

app.use("/api", router);
app.use("/", (req, res) => {
  return res.json({
    message: "Selamat Datang di API SPK-Skripsi",
  });
});

module.exports = app;
