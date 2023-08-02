import { AccountService } from "../service/account.service.js"

export const AccountRoute = (app) => {
    app.post("/api/register", async (req, res) => {
        try {
            await AccountService.createUser(req.body);
            res.status(200).send({ code: 200, message: "User Registered Successful!" })
        }
        catch (e) {
            console.error(e);
            res.status(e.code).send({ message: e.message });
        }
    });
}

// app.get("/api/test", async(req,res) =>{
//  console.log("hello world");
//  res.status(200).send({message: "ok"});
// });
