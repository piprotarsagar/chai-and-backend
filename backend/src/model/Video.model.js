import mongoose from 'mongoose'
import aggregatepaginate from 'mongoose-aggregate-paginate-v2'

const VideosSchema = new Schema( 
    
    {
        videofile:{
            type:String,
            required:true,

        },
        thumbnail:{ 
            type:strring,
            required:true
        },
        discription:{
            type:String,
            required:true,

        },
        durattion:{
            type:Number,
            required:true,

        },
        views:{
            type:Number,
            default : 0

        },
        ispublish:{
            type:Boolean,
            required:true
        } ,
        owner:{
            type:Schema.Types.ObjectId,
            ref:"user"
        }

     }
     , {
    timestamp:true
})

VideoSchema.plugin(aggregatepaginate)


export const video = mongoose.model("Video",VideoSchema)