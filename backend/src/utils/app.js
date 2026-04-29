import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
import cors from 'cors'
import cookieparser from 'cookie-parser' 
import express, { json } from "express"
import Connection from "../db/Connection.js" 

const app = express()

Connection()

app.on("error",(error)=>{
         console.log(error);
       })

app.listen(process.env.PORT || 5000 , ()=>{
         console.log(`server is running on port ${process.env.PORT}`)
       })

       app.use(cors({
        origin:process.env.ORIGIN
       }))

       app.use(express.json())
       app.use(express.urlencoded({extended:true}))
       app.use(express.static("public"))
       app.use(cookieparser())


       import userRouter from "../routes/user.routs.js"

       //route declaration using middleware and here userRouterr is controller, here you dont need middlewware that's why this field is empty 
       app.use("/api/v1/user",userRouter)


       export default { app }

