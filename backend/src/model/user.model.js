import mongoose, { Schema } from 'mongoose'
import  bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const UserSchema = new Schema(
    {
        username:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullrname:{
            type : String,
            required : true,
            trim : true
        },
        avtar:{
            type : String,
            required : true
        },
        coverimage:{
            type : String,
            required : true,
        },
        watchhistory:[{
            type : Schema.Types.ObjectId,
            ref:"Video"
        }],
        password:{
            type : String,
            required : [true,'password is required'],
            unique : true,
        },


     }
     
     ,{
        timestamps:true
     })

     /*always take call bake but callbacke don't have this.excess so always use function where you need this.excess*/
     /* ( err, req,res,next )=>{   }    this is middleware in js, this is by default iddlewaare and there exiist third party midddleware also like (cookieparser) , remember this everything you write inside app.use(here) most of the time it's  middleware */
     /* this pre hook comes with problem< it always run when user hit the save, when useer hit save after changing this pre hook alwaays runs and changes the password which we don't want solution :: you can use .isModified('term but always in string') */
     UserSchema.pre('save' , async function(next){
            if(!this.isModified('password')) return next();

           this.password = bcrypt.hash(this.password,10) 
        next()
            
     })

     UserSchema.methods.isPasswordCorrect = async function (password){
        return await bycrypt.compare( password , this.password )
     }


     /* jwt is use for generate acess and refresh token , method is simpple jwt.sign( {payload} , tokenId , {token expiry} )*/
     UserSchema.methods.getaccesstoken = function(){

        return jwt,sign(
            {
                _id : this._id,
                email : this.email 
            },
            
            process.env.ACCESSTOKEN_SECRET, 
            
            { expiresIn: process.env.REFRESHTOKEN_EXPIRY })
     }

     UserSchema.methods.getrefreshtoken = function(){

        return jwt,sign(
            {
                _id : this._id
            },
            
            process.env.REFRRESHTOKEN_SECRET, 
            
            { expiresIn: process.env.REFRESHTOKEN_EXPIRY })
     }


export const User = mongoose.model("User",UserSchema)