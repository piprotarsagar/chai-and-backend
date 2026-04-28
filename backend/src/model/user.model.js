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

     /* this pre hook comes with problem< it always run when user hit the save, when useer hit save after changing this pre hook alwaays runs and changes the password which we don't want solution :: you can use .isModified('term but always in string') */
     UserSchema.pre('save' , async function(next){
            if(this.isModified('password')){
           this.password = bcrypt.hash(this.password,10) 
        next()
            }
     })

export const User = mongoose.model("User",UserSchema)