import mongoose, { Schema,model } from "mongoose";

const  subscriptionmodel = new Schema({

    subscriber : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    channel : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }

},{ timestamps : true })

export const subscriptionmodel = mongoose.model("subscriptionmodel" , subscriptionmodel)