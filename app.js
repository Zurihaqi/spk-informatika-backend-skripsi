require("dotenv").config();
require("pg");
const express = require("express");
const app = express();
const router = require("./server/routes/app.routes");
const logger = require("morgan");
const cors = require("cors");
var path = require("path");
const authenticate = require("./server/middlewares/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);
app.use("/", (req, res) => {
  return res.json({
    message: "Selamat Datang di API SPK-Skripsi",
  });
});

module.exports = app;
