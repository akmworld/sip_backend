import mongoose from "mongoose";

export const Admin = new mongoose.model("Admin", new mongoose.Schema({
    firstName:  { type: String, required: true },
    lastName:   { type: String, required: true },
    email:      { type: String, required: true },
    password:   { type: String, required: true }
}), 'admin');
