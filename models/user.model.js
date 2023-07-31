import { boolean } from "webidl-conversions";
import mongoose from "mongoose"
// const mongoose = require("mongoose");

export const User = mongoose.model(
  "user",
  new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    setpassword: { type: String, required: true },
    confirmpassword: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    experience: { type: String, required: true },
    Referal: { type: String, required: true },
    Document: [{ type: Object }],
  }),
  "user"
);


