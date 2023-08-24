import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AccountService } from "./account.service.js";
import { User } from "../models/user.models.js";

dotenv.config();

export const AdminService = {

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
     return Admin.findOne(filter).exec();
    },



    generateAccessToken: async (email, password, persist) =>
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
        };
    
        const accessToken = jwt.sign(
          accessTokenResponse,
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: persist ? "1d" : "5h",
          }
        );
        return {
          email: existingAdmin.email,
          accessToken: accessToken,

      }

},
 
getAllUsers: async()=>
  {
    try{
      const existingUser = await User.find().exec();
      if(!existingUser)
      {
        throw({message:'User Not Found'})
      }
      console.log(existingUser)
      return(existingUser)

  }
  catch(err)
  {
    throw({message: err.message});
  }
},

updateUser: async (email, newData) => {
  try {
      const existingUser = await User.findOne({email: newData.email }).exec();

      if (!existingUser) {
          throw { code: 404, message: `User not found with email: ${email}` };
      }
      if (newData.firstName) {
          existingUser.firstName = newData.firstName;
      }
      if (newData.lastName) {
          existingUser.lastName = newData.lastName;
      }
      if (newData.email) {
          existingUser.email = newData.email;
      }
      if (newData.password) {
          existingUser.password = newData.password;
      }
      const updatedUser = await existingUser.save();
      return updatedUser;
  } catch (error) {
      throw { code: 500, message: "Failed to update user" };
  }
},

deleteUser: async (userData) =>
{
  const {firstName,lastName,email,password} = userData;
  try{

    const userToDelete = await User.findOneAndDelete({firstName,lastName,email,password}).exec();
    if(!userToDelete)
    {
      console.log('User Not Deleted', userData)
      throw({code:404,message:'User not found with provid information'})
    }
    console.log("User Delete Successfully",userData);
    return userData;
  } catch (error) {
    throw { code: error.code, message: error.message};
}
} ,

}
