require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");

const router = require("./routes/app.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(cors());

app.use("/api", router);
app.use("/", (req, res) => {
  res.json({
    message: "API untuk Sistem Pendukung Keputusan Pemilihan Peminatan",
  });
});

module.exports = app;
