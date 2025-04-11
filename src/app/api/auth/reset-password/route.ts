import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request : NextRequest){
    try{
        const { userId , password } = await request.json()

        if(!userId && !password){
            return NextResponse.json(
                { error : "Required userId and password"}
            )
        }

        await connectDB()

        const hashPassword = await bcrypt.hash(password, 10)

        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            password : hashPassword
        })

        console.log("updateUser",updateUser)

        return NextResponse.json(
            { message : "Password Updated successfully" },
            { status : 200 }
        )
    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}