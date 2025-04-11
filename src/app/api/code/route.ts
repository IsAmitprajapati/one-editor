import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";
import FileModel from "@/models/FileModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request : NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401}
            )
        }

        const { projectId , fileName } = await request.json()

        await connectDB()

        const data = await FileModel.findOne({
            name : fileName,
            projectId : projectId
        })

        return NextResponse.json(
            { 
                message : "Successfully",
                data : data
            },
            {
                status : 200
            }
        )

    } catch (error) {
        return NextResponse.json({
            error : "Something went wrong"
        },{
            status : 500
        })
    }
}

export async function PUT(request : NextRequest){
    try {
        const session = await getServerSession()

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401 }
            )
        }

        const { content, fileId } = await request.json()

        if(!fileId){
            return NextResponse.json(
                { error : "fileId is required"},
                { status : 400 }
            )
        }

        const updateContent = await FileModel.findByIdAndUpdate(fileId,{
            content : content
        })

        return NextResponse.json(
            { message : "Updated successfully"},
            { status : 200 }
        )

    } catch (error) {
        return NextResponse.json({
            error : "Something went wrong"
        },{
            status : 500
        })
    }
}