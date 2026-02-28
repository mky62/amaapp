import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt';
import { sendVrfMail as sendVerificationEmail } from "@/helpers/sendVrfMail";

export async function POST(req: Request ) {
    await dbConnect();

    try {
        const { username, email, password} = await req.json();

        const existingUserVerified = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUserVerified) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400}
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json (
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500}
            );
        }

        return Response.json (
            {
                success: true,
                message: 'User registered successfully. Please check your email for the verification code.',
            },
            { status: 201 }
        );
    }  catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}