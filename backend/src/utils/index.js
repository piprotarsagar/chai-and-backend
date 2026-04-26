import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
import express from "express"
import Connection from "../db/Connection.js" 

const app = express()
Connection()
 app.on("error",(error)=>{
         console.log(error);
       })

app.listen(process.env.PORT || 5000 , ()=>{
         console.log(`server is running on port ${process.env.PORT}`)
       })




















































//()() immidiate executionn , it's call effie
// ;(async()=>{
//     try{
//   const connect= await mongoose.connect(`${process.env.URI}/admin`)
//        console.log(`db is connected successfully !`);
//        app.on("error",(error)=>{
//          console.log(error);
//        })
//        app.listen(process.env.PORT || 5000 , ()=>{
//          console.log(`server is running on port ${process.env.PORT}`)
//        })
//     }
//     catch (error){
//       console.log(error);
//       throw error;
//     }

// })()