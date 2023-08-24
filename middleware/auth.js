import jwt from "jsonwebtoken";
import { AccountService } from "../service/account.service.js";
import { AdminService } from "../service/admin.service.js";

export const Authorize = (roles) => {

    return async (req, res, next) => {

        try {
            const authToken = req.headers.authorization;
            if(!authToken)
            {
                return res.status(401).send({code:404,message:"Invalid Login Attempt!"})
            }

           const user = jwt.verify(token,proccess.env.JWT_SECRET_KEY)
           if(!user)
           {
            return res.status(401).send({code:401, message:"Invalid Login Attempt 2!"})
           }

           let existingUser;
           if(roles.includes('user'))
           {
            existingUser = await AccountService.findUserById(user.id)
            if(!existingUser){
                return res.status(401).send({code:401, message:"Invalid Login Attempt For User"})
            }
           }

           const admin = jwt.verify(token,proccess.env.JWT_SECRET_KEY)
           let existingAdmin
           if(roles.includes('admin'))
           {
            existingAdmin = await AdminService.findUserById(admin.id)
            if(!existingAdmin)
            {
                return res.status(401).send({code:401, message:"Invalid Login Attempt for Admin"})
            }
           }

           next();
        }
         catch (err) {
            console.log(err)
            return res.status(401).send({code:401,message: err.message});
        }
    }
};