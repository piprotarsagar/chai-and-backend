import {asynchandler} from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from '../model/user.model.js'
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js"


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

export { registeruser , loginUser , logoutUser }