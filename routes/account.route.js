import { AccountService } from "../service/account.service.js"

export const AccountRoute = (app) => {
    app.post("/api/register", async (req, res) => {

        try {
            console.log('object', req.body)
            await AccountService.createUser(req.body);
            res.status(200).send({ code: 200, message: "User Registered Successful!" })
        }
        catch (e) {
            console.error(e);
            res.status(e.code).send({ message: e.message });
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
            if (!accessToken) {
                throw { code: 500, message: "failed to generate access token" };
            }

            const User = await User.findOne({ email: email });
            if (!User) {
                throw { code: 404, message: "User not found" };
            }
            else {
                res.status(404).json({ error: "User not found or access token is invalid" });

            }

        }
        catch (err) {
            console.error(err);
            res.status(err.code).send({ message: err.message });
        }

    });


    
}

