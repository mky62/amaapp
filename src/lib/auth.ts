import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import bcrypt from "bcrypt";
import UserModel from "@/src/model/User";
import dbConnect from "./dbConnect";


  const db = await dbConnect();

  type LoginType = {
  email: string;
  password: string;
};


export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,

    async authorize({ email, password }: LoginType) {
      const isUser = await UserModel.findOne({ email });

    if (!isUser) {
      throw new Error('No user found with this email');
    }
      if (!isUser.isVerified) {
        throw new Error("Email not verified");
      }

      const isValid = await bcrypt.compare(password, isUser.password);

      if (!isValid) {
        throw new Error("Invalid password");
      }

      return {
        id: isUser._id.toString(),
        email: isUser.email,
        name: isUser.username,
      };
    },
  },

  session: {
    expiresIn: 60 * 60 * 24, // 1 day
  },
});