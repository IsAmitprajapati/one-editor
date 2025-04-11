import { NextRequest,NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/config/connectDB";

export async function POST(request : NextRequest){
    try{
       const  { name , email , password } = await request.json()

       if(!name || !email || !password){
            return NextResponse.json({
                error : "Name, Email, and Password is required"
            })
       }

       await connectDB()

       const exitUser = await UserModel.findOne({ email })

       if(exitUser){
         return NextResponse.json(
            { error : "Already exit user"},
            { status : 400 }
         )
       }

       const user = await UserModel.create({
            name,
            email,
            password
       })

       return NextResponse.json(
            { message : "User registered successfull"},
            { status : 201 }
       )


    }catch(error){
        console.log(error)
        return NextResponse.json({
           error : "Failed to register user"
        },{
            status : 500
        })
    }
}