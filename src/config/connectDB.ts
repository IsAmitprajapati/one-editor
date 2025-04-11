import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in env file")
}


let cached = global.mongoose

if(!cached){
   cached = global.mongoose = { conn : null , promise : null }
}

export async function connectDB(){
    if(cached.conn){
        return cached.conn
    }

    //promise connect is not available 
    if(!cached.promise){
        const opts = {
            bufferCommands : false,
            maxPoolSize : 10
        }
        cached.promise = mongoose.connect(MONGODB_URI,opts).then((mongoose)=> mongoose.connection)
    }


    //promise is available
    try {
        cached.conn = await cached.promise 
    } catch (error) {
        cached.promise = null
        throw error
    }
}