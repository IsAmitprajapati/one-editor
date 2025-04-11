import mongoose from "mongoose";

export interface IProject {
    _id? : mongoose.Types.ObjectId;
    name : string;
    userId : mongoose.Types.ObjectId,
    createdAt? : Date
    updatedAt? : Date
}

const projectSchema = new mongoose.Schema<IProject>({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
},{
    timestamps : true
})

const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project',projectSchema)


export default ProjectModel