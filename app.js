require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
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
    message: "Test",
  });
});

// app.use(express.static(path.join(__dirname, "public")));
// app.use(logger("combined"));
// app.use(cors());

module.exports = app;
