import express from "express";
import dotenv from 'dotenv';
import { AccountRoute } from "./routes/account.route.js";
import { AdminRoute } from "./routes/admin.route.js"
import mongoose from "mongoose";
import bodyParser from "body-parser";
//import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_NAME });





// app.post("/api/test", async(req,res) =>{
//   try {
//     console.log("hello world");
//     res.status(200).send({message: "ok"});
    
//   } catch (error) {
//     console.log(error)
    
//   }
 
//  });


AccountRoute(app);
AdminRoute(app);

app.listen(process.env.PORT, () => {
  console.log(`Read the docs - http://localhost:${process.env.PORT || 8080}`);
});
