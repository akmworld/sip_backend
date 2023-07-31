import express from "express";
import dotenv from 'dotenv';
import {AccountsRoute} from "./routes/account.route.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
dotenv.config();

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



AccountsRoute(app);

app.listen(process.env.PORT, () => {
  console.log(`Read the docs - http://localhost:${process.env.PORT}`);
});
