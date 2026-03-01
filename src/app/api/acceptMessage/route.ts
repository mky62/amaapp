import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { headers } from "next/headers";


// update message acceptance preference for the user

export async function POST(request: Request) {

    await dbConnect();

    const session = await auth.api.getSession({
        headers: await headers(), // or headers: req.headers
    });

    if (!session) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        )
    }

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user.id,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if(!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

         return Response.json(
      {
        success: true,
        message: "Message acceptance updated",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

//. Fetch message acceptance preference for the user

export async function GET() {
   

    await dbConnect();

        const session = await auth.api.getSession({
            headers: await headers(), // or headers: req.headers
        });

        if (!session) 
            {
                return Response.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
                );
            }
            try {
                const foundUser  = await UserModel.findById(session.user.id);

                if (!foundUser) {
                    return Response.json(
                        { success: false, message: "user not found "},
                        { status: 404}
                    );
                }
            return Response.json(
                {
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessages,
                },
                { status: 200 }
                );
            } catch (error) {
                console.error(error);

                return Response.json(
                { success: false, message: "Fetch failed" },
                { status: 500 }
                );
            }
            }