import mongoose from "mongoose";
export const User = new mongoose.model(
    "User",
    new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        emailVerification: {type:Boolean, default:false},
        password: { type: String, required: true },
        confirmPassword: { type: Boolean, default: false },
        referral: { type: String },
        tokens: {
            emailVerification: { type: String },
            passwordReset: { type: String },
            // generateAccessToken: {type:String},
          },
    }),
    "users",
);