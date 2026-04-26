import mongoose from "mongoose"

const Connection = async()=>{
    try{
  const connect= await mongoose.connect(`${process.env.URI}/admin`)
       console.log(`db is connected successfully !`);
      
    }
    catch (error){
      console.log(error);
      throw error;
    }

}

export default Connection  