const express = require("express");
const mongoose = require("mongoose");
// const { default: AccountsRoute } = require("./routes/account.route");
//import AccountsRoute from "./routes/account.route";
// import mongoose from "mongoose";
// import bodyParser from "bodyParser";
require("dotenv").config();

const app = express();
app.use(express.json);
const AccountsRoute = require("./routes/account.route");

const DB =
  "mongodb+srv://codenetsoftwareswb:d8dqOX5JQbXg0obg@cluster0.3x4csap.mongodb.net/SIPBACKEND";
mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log("no connection"));



AccountsRoute(app);
app.listen(process.env.PORT, () => {
  console.log(`Read the docs - http://localhost:${process.env.PORT}`);
});
