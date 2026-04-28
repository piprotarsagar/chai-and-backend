const asynchandler = ( fn )=>{
 async (err,req,res,next)=>{
    try{
        await fn (err,req,res,next){
            
        }

    }
    catch(err){
        res.send(err.code || 500).json({
            sucess:false,
            massage:"you are failed !!"
        })
    }
 }

}

export default asynchandler 