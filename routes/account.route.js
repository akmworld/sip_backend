import { AccountService } from "../service/account.service.js"
import { User } from '../models/user.models.js'
import multer from "multer";


export const AccountRoute = (app) => {
    app.post("/api/register", async (req, res) => {

        try {
            console.log('object', req.body)
            await AccountService.createUser(req.body);
            res.status(200).send({ code: 200, message: "User Registered Successful!" })
        }
        catch (e) {
            console.error(e);
            res.status(500).send({ code: 500, message: e.message });
        }

    });

    app.post("/api/verify-email", async (req, res) => {
        try {
            const { user, code } = req.body;
            await AccountService.verifyEmail(user, code);
            res.status(200).send({ code: 200, message: "Email verified successfully" });
        } catch (e) {
            console.error(e);
            res.status(500).send({ code: 500, message: e.message });
        }

    });

    app.post("/api/user-login", async (req, res) => {
        try {
            const { email, password, persist } = req.body;
            if (!email) {
                throw { code: 400, message: "email id is required" };
            }
            if (!password) {
                throw { code: 400, message: "password is required" };
            }
            const accessToken = await AccountService.generateAccessToken(
                email,
                password,
                persist
            );
            console.log(accessToken)
            if (!accessToken) {
                throw { code: 500, message: "failed to generate access token" };
            }

            const user = await User.findOne({ email: email });
            if (user && accessToken) {
                res.status(200).send({
                    token: accessToken
                })
            } else {
                res.status(404).json({ error: "User not found or accesss token is invalid" })
            }
        }
        catch (err) {
            console.error(err);
            res.status(err.code).send({ message: err.message });
        }

    });

    app.post("/api/initiate-reset-password", async (req, res) => {
        try {
            const { email } = req.body;
            await AccountService.sendResetPasswordEmail(email);
            res.status(200).send({ message: "Password Reset code sent" });
        } catch (err) {
            console.error(err);
            res.status(err.code).send({ message: err.message });
        }
    });

    app.post("/api/reset-password", async(req,res) => {
        try{
            const { code,email,password} = req.body;
            await AccountService.verifyPasswordResetCode(code,email,password);
            res.status(200).send({message: "Password reset successful"});
        }catch(err) {
            console.error(err);
            res.status(err.code).send({message: err.message});
        }
    });
 

};

