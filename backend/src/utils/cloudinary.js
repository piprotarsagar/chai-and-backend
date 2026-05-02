import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("ENV CHECK:");
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_KEY);
console.log(process.env.CLOUD_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

console.log("CONFIG:", cloudinary.config());

const uploadoncloudinary = async (localFilePath) => {

    try {

        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath);

        console.log(response.url);

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {

        console.log("CLOUDINARY FULL ERROR:");
        console.log(error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadoncloudinary };