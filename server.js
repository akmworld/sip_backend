import express from "express";
import dotenv from 'dotenv';
import { AccountRoute } from "./routes/account.route.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
//import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_NAME });





// app.get("/api/test", async(req,res) =>{
//   console.log("hello world");
//   res.status(200).send({message: "ok"});
//  });


AccountRoute(app);


app.listen(process.env.PORT, () => {
  console.log(`Read the docs - http://localhost:${process.env.PORT || 8080}`);
});
