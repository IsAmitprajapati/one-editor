import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(request : NextRequest){
    try{
        const { token } = await request.json()

        if(!token){
            return NextResponse.json({
                error : "Token is required"
            }, {
                status : 400
            })
        }

        const verifyToken:any = await jwt.verify(token,process.env.FORGOT_PASSWORD_SECRET_KEY!)

        if(!verifyToken){
            return NextResponse.json({
                error : "Token is expired",
                expired : true
            }, {
                status : 400
            })
        }

        console.log("verifyToken",verifyToken)

        return NextResponse.json({
            message : "Token is valid",
            userId : verifyToken ? verifyToken?.id : null,
            expired : false
        })

    }catch(error){
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}