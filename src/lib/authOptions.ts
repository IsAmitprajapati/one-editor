import { connectDB } from '@/config/connectDB'
import UserModel from '@/models/User'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'


export const authOptions:NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : { label : "Email" , value : "text"},
                password : { label : "Password", value : "text"}
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials.password){
                    throw new Error("Email and Password is missing")
                }

                try{
                    await connectDB()

                    const user = await UserModel.findOne({ email   : credentials.email})

                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isValidPassword){
                        throw new Error("Invalid Password")
                    }

                    return {
                        id : user._id.toString(),
                        email : user.email,
                        name : user.name,
                        image : user.picture || "",
                    }
                }catch(error){
                    throw error
                }
            },
        }),
    ],
    callbacks : {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string
            }
            console.log(session)
            return session
        }
    },
    pages : {
        signIn : "/login",
        error : "/login"
    },
    session : {
        strategy : 'jwt',
        maxAge : 30 * 24 * 60 * 60
    },
    secret : process.env.NEXTAUTH_SECRET
}