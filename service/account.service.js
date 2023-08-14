
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { User } from '../models/user.models.js';


//import dotenv from "dotenv";
dotenv.config();

export const AccountService = {
    createUser: async (data) => {
        const existingUser = await User.findOne({ email: data.email }).exec();
        if (existingUser) {
            throw { code: 409, message: `User already exists: ${data.email}` };
        }
        if (!data.firstName) {
            throw { code: 400, message: "First name is required" };
        }
        if (!data.lastName) {
            throw { code: 400, message: "Last name is required" };
        }
        if (!data.email) {
            throw { code: 400, message: "Email is required" };
        }
        if (!data.password) {
            throw { code: 400, message: "Password is required" };
        }
        const Passwordsalt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
        const emailVerificationcode = crypto.randomBytes(6).toString('hex');
        const newUser = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: encryptedPassword,
            emailVerification: false,
            tokens: {
                emailVerification: emailVerificationcode,
            },
        });
        console.log(newUser)
        newUser.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save user" };
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_CLIENTID,
                pass: process.env.SMTP_CLIENTSECRET,
            },
        });

        // transporter.on('debug', console.log);
        console.log('trans', transporter)

        try {
            await transporter.sendMail({
                from: `'Codenet Softwares pvt Ltd' <${process.env.SMTP_SENDER}>`,
                to: data.email,
                subject: "Verify your email",
                text: `Your verification code is ${emailVerificationcode}`,
            });
            console.log('Email sent successfully');
        } catch (err) {
            console.error(err);
            throw { code: 500, message: "failed to send verification email" };
        }

        return true;
    },

    findUserById: async (id) => {
        if (!id) {
            throw { code: 409, message: "Required parameter: id" };
        }
        return User.findUserBy(id).exec();
    },

    findUser: async (filter) => {
        if (!filter) {
            throw { code: 409, message: "Required parameter: filter" };
        }
        return User.findOne(filter).exec();
    },

    verifyEmail: async (email, code) => {
        const existingUser = await AccountService.findUser({ email: email });
        if (!existingUser) throw { code: 404, message: `Invalid user ${email}` };

        if (existingUser.emailVerified) {
            throw { code: 400, message: `Email already verified for: $(email)` };
        }

        if (existingUser.tokens.emailVerification !== code) {
            throw { code: 401, message: `Invalid verification code: ${code}` };
        }
        existingUser.emailVerified = true;
        existingUser.tokens.emailVerification = null;
        existingUser.save();

    },

    generateAccessToken: async (email, password, persist) => {
        if (!email) {
            throw { code: 400, message: "Invalid value for: email" };
        }
        if (!password) {
            throw { code: 401, message: "Invalid value for: password" };
        }

        const existingUser = await AccountService.findUser({ email: email });
        console.log('existingUser', existingUser)
        if (!existingUser) {
            throw { code: 401, message: "Invalid email address or password" };
        }
        const passwordValid = await bcrypt.compare(password, existingUser.password);
        if (!passwordValid) {
            throw { code: 401, message: "Invalid email address or password" };
        }
        // if (!existingUser.emailVerified) {
        //     throw { code: 403, message: "Email not verified" };
        // }

        const accessTokenResponse = {
            id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email

        };
        const accessToken = jwt.sign(
            accessTokenResponse,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: persist ? "1d" : "8h",
            },
            // await generateAccessToken.save();
        );
        // await generateAccessToken.save();
        
        return {
            email: existingUser.email,
            accessToken: accessToken,

        };

    },

    sendResetPasswordEmail: async (email) => {
        const existingUser = await AccountService.findUser({ email: email });

        if (!existingUser) {
            throw { code: 409, message: "First register with company's portal" };
        }

        const emailVerificationcode = await crypto.randomBytes(6).toString("hex");
        existingUser.tokens.passwordReset = emailVerificationcode;
        existingUser.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save new password" };
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_CLIENTID,
                pass: process.env.SMTP_CLIENTSECRET,
            },
        });
        console.log('trans', transporter)

        try {
            await transporter.sendMail({
                from: `'Codenet Softwares pvt Ltd' <${process.env.SMTP_SENDER}>`,
                to: email,
                subject: "Password Reset code",
                text: `Your Password reset code is ${emailVerificationcode}`,
            });
            console.log('Email sent successfully');
        } catch (err) {
            console.error(err);
            throw { code: 500, message: "failed to send Password reset email" };
        }

        return existingUser;
    },

    verifyPasswordResetCode: async (code, email, password) => {

        const existingUser = await AccountService.findUser({ email: email });
        if (existingUser.tokens.passwordReset !== code) {
            throw { code: 401, message: "Wrong code input" }
        }

        const passwordisDuplicate = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (passwordisDuplicate) {
            throw { code: 409, message: "new password cannot be same as existing password" };
        }

        const Passwordsalt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, Passwordsalt);

        existingUser.password = encryptedPassword;
        existingUser.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save new password" };
        });
        return true;
    }



}




