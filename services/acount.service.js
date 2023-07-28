import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { error } from "console";

export const AccountService = {
  createUser: async (data) => {
    if (!data.firstname) {
      throw { code: 400, message: "Firstname is required" };
    }
    if (!data.lastname) {
      throw { code: 400, message: "Lastname is required" };
    }
    if (!data.email) {
      throw { code: 400, message: "Email is required" };
    }
    if (!data.password) {
      throw { code: 400, message: "Password is required" };
    }
    const existingUser = await User.findOne({ email: data.email }).exec();
    if (existingUser) {
      throw { code: 409, message: `User already exists: ${data.email}` };
    }
    const passwordSalt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(data.password, passwordSalt);
    const emailVerificationCode = await crypto.randomBytes(6).toString("hex");
    const newUser = new User({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: encryptedPassword,
      emailVerified: false,
    });

    console.error("Error creating New User:", error.message);
    newUser.save().catch((err) => {
      console.error(err);
      throw { code: 500, message: "Failed to save user" };
    });
  },
};
