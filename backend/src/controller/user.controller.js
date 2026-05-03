import {asynchandler} from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from '../model/user.model.js'
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js"
import Jwt from "jsonwebtoken"

const genarateaccessandrefreshtokens = async(userid)=>{
    try{
       const user = await User.findById(userid)
        const refreshtoken = user.getrefreshtoken()
        const accesstoken = user.getaccesstoken()
        // we have to store this refreshtoken to our db, so create this entry and transfer the value
        user.refreshtoken = refreshtoken

        //mongo method to save entry in db
        await user.save({validateBeforeSave:false})
        
        return { accesstoken , refreshtoken }

    }
    catch(err){
        console.error("DEBUG ERROR:", err);
        throw new Apierror(401,"error in generating access and refreshtoken")
    }
}


//register user logic
const registeruser = asynchandler( async (req,res)=>{
        // get user detail from fronntend
        // validation - not empty
        // check if user already exist or new : username , email
        // check for avatar and immage
        // upload them to cloudinary , avatar
        // create user object , create entry in db
        // remove password and refresnce token from response
        // check for user creation
        // return response

        const { username , email , fullname , password } = req.body
        

        //[1, 2, 3, 4].some(num => num > 3) Result: true (because one value is empty)  .some:“Does at least one item in this array satisfy the condition?”
            if ([fullname, email, password, username].some((field) => typeof field !== "string" || field.trim() === "")) {
                throw new Apierror(400, "All fields are required");
            }

            const existeduser = await User.findOne({
                                $or: [{ username },{ email }]
                            })

             if(existeduser){
                    throw new Apierror (400, ' user with email ')
                }
                console.table(req.files)

const avatarlocalpath = await req.files?.avatar?.[0]?.path;
const coverimagelocalpath = await req.files?.coverimage?.[0]?.path;

console.log("Avatar Path:", avatarlocalpath);
console.log("Cover Path:", coverimagelocalpath);

if (!avatarlocalpath) {
    throw new Apierror(400, "Avatar file is required");
}
            

    const avatar = await uploadoncloudinary(avatarlocalpath)
    const coverimage = await uploadoncloudinary(coverimagelocalpath)

         if(!avatar){
        throw new Error("avatar upload failed")

    } 

            // let coverImageLocalPath;
            // if (req.files && Array. isArray(req.files.coverImage) && req.files.coverImage.length > 0) 
            //     {  coverImageLocalPath = req.files.coverImage[0].path }

            const user = await User.create({
                fullname,
                avatar : avatar.url,
                coverimage : coverimage?.url||"",
                email,
                password,
                username : username.toLowerCase()
            })

            const createduser = await User.findById(user._id).select("-password -refreshtoken")

              if(!createduser){
                throw new Apierror(500,"error in registring the user")

            }

            return res.status(201).json(
               new  Apiresponse(200 , createduser , "data created successfully" )
            )

})

//login user logic

const loginUser = asynchandler(async (req,res)=>{
     // req.body -> data
     // check username or email exist in database ?
     // find the user
     // password check
     //if pass is checked ? then generate accesstoken and refreshtoken
     /// send cookie (access and refreshtoken)

     const { username, email, password } = req.body

     if(!(username || password)){
        throw new Apierror(400,"user or email not found")
     }

     const user = await User.findOne({
        $or : [{email},{username}]
})

if(!user){
    throw new Apierror(404,"user noot found")
}

const ispasswordvalid = await user.isPasswordCorrect(password)

if(!ispasswordvalid){
    throw new Apierror(401,"password is  invalid")
}



const { accesstoken , refreshtoken } = await genarateaccessandrefreshtokens(user._id)

const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")

const options = {
    httpOnly : true,
    secure : false
}
console.log("LOGIN DATA CHECK:", { loggedinuser, accesstoken, refreshtoken });

return res.status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(new Apiresponse(200, { user: loggedinuser, accesstoken, refreshtoken }, "user logged in successfully"));
    
})


//logout user logic

const logoutUser = asynchandler(async (req,res)=>{

    await User.findByIdAndUpdate(req.user._id,{ $set:{refreshtoken:undefined}},{new : "true"})

    const options = {
    httpOnly : true,
    secure : false
}

return res.status(200).clearCookie("accesstoken",options)
.clearCookie("refreshtoken",options).json(
    new Apiresponse(200,{},"cookie successfully removed and user logged out")
)

})

// Refresh accesstoken
const refreshaccesstoken = asynchandler(async (req, res) => {
    // 1. Get the REFRESH token (not access) vause accesstokenn is expired
    const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken;

    if (!incomingrefreshtoken) {
        throw new Apierror(401, "Refresh token is missing");
    }

    // 2. Verify with the correct Secret
    const decodedtoken = Jwt.verify(incomingrefreshtoken, process.env.REFRESHTOKEN_SECRET);

    // 3. AWAIT is required here
    const user = await User.findById(decodedtoken?._id);

    if (!user) {
        throw new Apierror(404, "User not found");
    }

    // 4. Validate against the DB record
    if (incomingrefreshtoken !== user?.refreshtoken) {
        throw new Apierror(401, "Refresh token is expired or already used");
    }

    // 5. Generate the new set
    const { accesstoken, refreshtoken: newrefreshtoken } = await genarateaccessandrefreshtokens(user._id);

    const options = { httpOnly: true, secure: false };

    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", newrefreshtoken, options)
        .json(new Apiresponse(204, { accesstoken, refreshtoken: newrefreshtoken }, "Token refreshed"));
});

// it  is time to make own middleware 

   //change password middleware
   const changecurrentpassword = asynchandler(async(req,res)=>{

     const { oldpassword ,newpassword} = req.body
     if(!(oldpassword || newpassword)){
        throw new Apierror(401,"cannot get old and new password")
     } 

     const ispasscorrect = isPasswordCorrect(oldpassword)

     if (ispasscorrect == false){
        throw new Apierror("401" , "your old pass is not same as your db pass")
     }

     const user = await User.findByIdAndUpdate(user._id,{
         $set : {
            password : newpassword
         }
     })

     const options = {
        httpOnly : true,
        secure : false
     }
   
     return res.status(205).cookie("user",user,options).json(
         new Apiresponse(208,{user},"password update successfully") 
     )
   })

   //get current user
   const getcurrentuser = asynchandler(async(req,res)=>{
    const currentuser = await User.findById(user._id)

    if(!currentuser){
        throw new Apierror(309,"currrent user not found")
    }

    return res.status(209).json(
        new Apiresponse(203,user,"successfully fetching current user")
    )
   })

   //update account detail
   const updateaccountdetail = asynchandler(async(req,res)=>{
    const {fullname, email} = req.body

        if(!(fullname || email)){
            throw new Apierror(302,"provide fullname and email please")
        }

    const user = User.findByIdAndUpdate(req.user._id,{
        $set : {
            fullname : fullname,
            email : email
        }
    })

    return res.status(209).json(
        new Apiresponse(204,user,"updated account detail successfully")
    )

   })
 
   //update user avatar
   const updateuseravatar = asynchandler(async(req,res)=>{
    const avatarlocalpath = req.file.path

    if(!avatarlocalpath){
            throw new Apierror(302,"provide avatar local path")
        }

        const avatar = await uploadoncloudinary(avatarlocalpath)

        if(!avatar.url){
            throw new Apierror(303,"unable to fetch cloudinary avatar url")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,{
                $set :{
                        avatar : avatar.url
                        }
                            }).select("-password")

        return  res.status(210).json(
            new Apiresponse(201,user,"avatar updated successfully in cloudinary")
        )
     
   })

export { registeruser , loginUser , logoutUser, refreshaccesstoken , changecurrentpassword , getcurrentuser , updateaccountdetail , updateuseravatar}