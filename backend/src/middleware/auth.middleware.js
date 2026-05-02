import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import JWT from "jsonwebtoken"
import { User } from "../model/user.model.js";

export const verifyJWT = asynchandler (async (req,res,next)=>{
   try {
     //access token
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new Apierror(401, "you dont have access token")
        }
       console.log("Token received from client:", token);
        const decodedtoken = await JWT.verify(token,process.env.ACCESSTOKEN_SECRET)  
        
        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")

        if(!user){
            throw new Apierror(401, "invalid access token")
        }

        req.user = user

        next()
   } catch (error) {
    throw new Apierror(401, error?.message || "Invalid access token");
   }

})