import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

dotenv.config();

export const AdminService = {

    findUser: async (filter) => {
     if (!filter) {
        throw { code: 409, message: "Required parameter: filter" };
     }
     return Admin.findOne(filter).exec();
    },

    generateAccessToken: async (email, password) =>
     {
        if (!email)
         {
             throw { code: 400, message: 'Invalid email value' }; 
         }
       if (!password)
        { 
            throw { code: 400, message: 'Invalid password value' };
        }
        const existingAdmin = await AdminService.findUser({ email: email});
        console.log('admin',existingAdmin)
        if(!existingAdmin)
        {
          throw{code:400, message:'Invalid Email or Password'}
        }

        const accessTokenResponse = {
          id: existingAdmin._id,
          firstName: existingAdmin.firstName,
          lastName: existingAdmin.lastName,
          email: existingAdmin.email,
          password: existingAdmin.password,
        };
    
        const accessToken = jwt.sign(
          accessTokenResponse,
          process.env.JWT_SECRET_KEY,
          {
            expiresIn:  "1h",
          }
        );
        return {
          email: existingAdmin.email,
          accessToken: accessToken,

      };
    

}
}