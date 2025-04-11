import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const recentProject = await ProjectModel.find({
      userId: session.user.id,
    })
      .sort({ updatedAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        message: "Recent Project",
        data: recentProject,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
