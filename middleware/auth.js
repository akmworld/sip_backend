import { Jwt } from "jsonwebtoken";
import { AccountService } from "../service/account.service";

export const Authorize = () => {

    return async (req, res, next) => {

        try {
            const authToken = req.headers.authorization;
        }
        catch (err) {
            console.log(err)
        }
    }
}