import UserModel from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/config/resendemail";
import { ForgotPasswordEmail } from "@/components/template/ForgotPasswordEmail";
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
    const host = request.headers.get('host') //domain 
    const protocol =host?.includes('localhost') ? 'http' : 'https'
    const DOMAIN = `${protocol}://${host}`
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB()

    const exituser = await UserModel.findOne({ email });

    if (!exituser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const payload = {
      id: exituser?._id?.toString(),
    };

    var token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET_KEY!,{
        expiresIn : 60 * 60 //1hr expired
    });

    const URL = `${DOMAIN}/reset-password?token=${token}`

    //sending email
    await sendEmail(
        exituser.email,
        "Forgot Password from one Editor",
        ForgotPasswordEmail({
           name : exituser.name,
           url : URL 
        })
    )

    return NextResponse.json({
        message : "Check your email."
    },{
        status : 200
    })

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
