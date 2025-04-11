import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FileModel from "@/models/FileModel";
import { hmltBoilerplateCode, scriptBoilrPlatCode, styleBoilrPlatCode } from "@/lib/sampleCode";

//create project
export async function POST(request : NextRequest){
    try {
        const { name } = await request.json()

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401 }
            )
        }

        if(!name){
            return NextResponse.json(
                { error : "Name is required"},
                { status : 400 }
            )
        }

        await connectDB()

        const project = await ProjectModel.create({
            name : name,
            userId : session.user.id 
        })
        
        //index.html
        //style.css
        //script.js

        //index.html
        await FileModel.create({
            name : "index.html",
            projectId : project._id,
            content : hmltBoilerplateCode
        })

         //style.css
         await FileModel.create({
            name : "style.css",
            projectId : project._id,
            content : styleBoilrPlatCode
        })

         //script.js
         await FileModel.create({
            name : "script.js",
            projectId : project._id,
            content : scriptBoilrPlatCode
        })


        return NextResponse.json(
            { 
              message : "Project Created Successfully",
              data : project
            },
            { status : 201 }
        )
        

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}

// all the project with session user id
export async function GET(request : NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({
                error : "Unauthorized"
            },{
                status : 401
            })
        }

        const searchParams = request.nextUrl.searchParams

        /**
         * for speficic project data single project ( one )
         */
        const projectId = searchParams.get('projectId') 

        const page = Number(searchParams.get("page")) || 1
        const limit = Number(searchParams.get('limit')) || 6

        const skip = (page - 1) * limit;

        //connect to db
        await connectDB()

        const filterProject = {
            userId : session.user.id,
            ...( projectId  && {  _id : projectId,  })
        }

        const projectList = await ProjectModel.find(filterProject).sort({createdAt : -1 }).skip(skip).limit(limit)

        const totalCount = await ProjectModel.countDocuments(filterProject)

        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json(
            { 
                message : "Project list",
                data : projectList,
                totalPages : totalPages,
                totalCount : totalCount
            },
            { 
                status : 200
            }
        )


    } catch (error) {
        console.log("error",error)
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}

//update project
export async function PUT(request : NextRequest){
    try {
        const { name, projectId } = await request.json()

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status : 401 }
            )
        }

        if(!name){
            return NextResponse.json(
                { error : "Name is required"},
                { status : 400 }
            )
        }

        await connectDB()

        const updateProject = await ProjectModel.findByIdAndUpdate(projectId, {
            name : name
        })

        return NextResponse.json(
            { message : "Project updated successfully"},
            { status : 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}