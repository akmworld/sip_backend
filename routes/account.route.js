 //import { User } from "../models/user.model.js";
 require("../services/acount.service.js");

 const AccountsRoute = (app) => {

  app.post("/api/accounts/register", async (req, res) => {
    try {
      await AccountService.createUser(req.body);
      console.log("hey there");
      res
        .status(200)
        .send({ code: 200, message: "User Registered succesfully" });
    } catch (e) {
      console.error(e);
      res.status(e.code).send({ message: e.message });
    }
  });

  app.post("/api/accounts/verify-email", async (req, res) => {
    try {
      const { user, code } = req.body;

      res
        .status(200)
        .send({ code: 200, message: "Email verified successfully" });
    } catch (e) {
      console.error(e);
      res.status(e.code).send({ message: e.message });
    }
  });

  app.post("/api/account/admin-login", async (req, res) => {
  
    try {
       const { fullname, empID, persist } = req.body;
      console.log("admin");
      if (!fullname) {
        throw { code: 400, message: "Full name is required" };
      }
      if (!empID) {
        throw { code: 400, message: "Employee Id is required" };
      }
      if (!Password) {
        throw { code: 400, message: "Password is required" };
      }
    } catch (e) {
      console.error(e);
      res.status(e.code).send({ message: e.message });
    }
  });
};
 
module.exports= AccountsRoute;
