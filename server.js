const express = require("express");
const mongoose = require("mongoose");
// import mongoose from "mongoose";
// import bodyParser from "bodyParser";
require("dotenv").config();

const app = express();
app.use(express.json);

const DB =
  "mongodb+srv://codenetsoftwareswb:d8dqOX5JQbXg0obg@cluster0.3x4csap.mongodb.net/SIPBACKEND";
mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log("no connection"));

app.listen(process.env.PORT, () => {
  console.log(`Read the docs - http://localhost:${process.env.PORT}`);
});
