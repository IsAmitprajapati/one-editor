import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";
import FileModel from "@/models/FileModel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; fileName: string }> }
) {
  const { projectId, fileName } = await params;

  if (!projectId || !fileName) {
    return new NextResponse("Provided projectId and fileName", {
      headers: {
        "content-type": "text/html",
      },
    });
  }

  //get extension of fileName
  const extArray = fileName?.toString()?.split(".");
  const extension = extArray[extArray?.length - 1];

  try {
    await connectDB();

    const getFile = await FileModel.findOne({
      name: fileName,
      projectId: projectId,
    });

    const content = getFile.content

    if (extension === "html") {
      //@/style.css
      //http://localhost:3000/api/file/projectId/fileNamewithExtension
      //src="@/" => /http://localhost:3000/api/file/projectId

      const host = request.headers.get("host"); //domain
      const protocol = host?.includes("localhost") ? "http" : "https";
      const DOMAIN = `${protocol}://${host}`;

      const URL = `${DOMAIN}/api/file/${projectId}`
      const replaceHTML = content.replace(/(src|href)=["']@(.*?)["']/g,`$1=${URL}$2`);

      return new NextResponse(replaceHTML, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
    else if(extension === 'css'){
        return new NextResponse(content, {
            headers: {
              "content-type": "text/css",
            },
          }); 
    }
    else if(extension === 'js'){
        return new NextResponse(content, {
            headers: {
              "content-type": "text/javascript",
            },
          }); 
    }


    return new NextResponse(content, {
        headers: {
          "content-type": "text/text",
        },
    }); 


  } catch (error) {
    return new NextResponse("Something went wrong", {
      headers: {
        "content-type": "text/html",
      },
    });
  }
}
