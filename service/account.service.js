import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { User } from '../models/user.models.js';


import dotenv from "dotenv";
dotenv.config();

export const AccountService = {
    createUser: async (data) => {
        const existingUser = await User.findOne({ email: data.email }).exec();
        if (existingUser) {
            throw { code: 409, message: `User already exists: ${data.email}` };
        }
        const Passwordsalt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
        const emailVerificationcode =  crypto.randomBytes(6).toString('hex');
        const newUser = new User({
            firstName: data.firstName,
            lastname: data.lastname,
            email: data.email,
            password: encryptedPassword,
            emailVerification: false,
            tokens: {
                emailVerification: emailVerificationcode,
            },
        });
        console.log(newUser)
        if (!data.firstName) {
            throw { code: 400, message: "First name is required" };
        }
        if (!data.lastname) {
            throw { code: 400, message: "Last name is required" };
        }
        if (!data.email) {
            throw { code: 400, message: "Email is required" };
        }
        if (!data.password) {
            throw { code: 400, message: "Password is required" };
        }
        newUser.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save user" };
        });
        return true;
        // nodemailer part starts- email verification
    }
}
