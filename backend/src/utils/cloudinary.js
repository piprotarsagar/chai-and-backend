const cloudinary = require('cloudinary').v2 ;
import fs from'fs' ;
 
/* we are uploaading file from device to locaal server using multer, and then using cloudinary we can upload it into our database,cloudinary is sdk. */
/* fs is noodes functionality to read write file */
/* multer is used to upload the file from anypath from device */

cloudinary.config({ 
  cloud_name: 'process.env.CLOUD_NAME', 
  api_key: 'process.env.CLOUD_KEY', 
  api_secret: 'process.env.CLOUD_SECRET'
})

const uploadoncloudinary = async (localpath)=>{
try{
    if (!localpath) return null;
    const result = await cloudinary.uploader.upload(localpath,{
        resource_type:'auto'
    })
    console.log('cludinary upload successful')
    console.log(result.url)
   return result ;

}
catch(err){
  fs.unlinkSync(localpath)
  //remove the local file to save system from interpetaation
   return null;

}
}

export {uploadoncloudinary}