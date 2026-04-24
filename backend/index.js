import express from 'express'
 const app = express()

 app.listen(5500,()=>{
    console.log("server is running at port 5500");
    
 })
 app.get("/",(req,res)=>{
    res.send("Maaa & Mahadev")
 })