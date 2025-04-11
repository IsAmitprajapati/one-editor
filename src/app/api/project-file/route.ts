import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FileModel from "@/models/FileModel";

//create file with projectId
export async function POST(request : NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401 }
            )
        }
        const { name ,projectId } = await request.json()

        if(!name || !projectId){
            return NextResponse.json(
                { error : "name and projectId is required"},
                { status : 400 }
            )
        }

        await connectDB()

        const checkFileName = await FileModel.findOne({ 
            name : name,
            projectId : projectId
        })

        if(checkFileName){
            return NextResponse.json(
                { error : "File name is already exits"},
                { status : 400 }
            )
        }

        const newFile = await FileModel.create({
            name : name,
            projectId : projectId 
        })

        return NextResponse.json(
            { message : "File created successfully"},
            { status : 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}

//get file with projectId
export async function GET(request : NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401 }
            )
        }

        const searchParams = request.nextUrl.searchParams
        const projectId = searchParams.get("projectId")

        await connectDB()

        const allFile = await FileModel.find({
            projectId : projectId
        }).select("-content")

        return NextResponse.json(
            { 
                message : "All file with respect to project",
                data : allFile
            },
            { status : 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        ) 
    }
}