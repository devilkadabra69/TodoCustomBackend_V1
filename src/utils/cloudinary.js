import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadToCloudinary = async (localFilePath) => {
    try {
        if (localFilePath) {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
                public_id: "images/" + Date.now(),
                folder: "/images",
                use_filename: true,
                unique_filename: true
            }, (err, result) => {
                if (err) console.log("Error on upload to local to cloudinary :: line 16 cloudinary.js :: \n", err);
                if (result) console.log("Successfully uploaded to cloudinary :: line 17 cloudinary.js :: \n", result);
            })
            console.log("Successfully uploaded to cloudinary :: line 24 cloudinary.js :: \n", response.url);
            fs.unlinkSync(localFilePath); // delete the local file after uploading to cloudinary
            return response; // we are returning response we can fetch the url anyways
        } else {
            console.log("localFilePath was null or something buggy in it");
            return null;
        }
    } catch (error) {

        // remove the localFile from the files in case of error occured
        fs.unlinkSync(localFilePath);
        console.error("Something went wrong while uploading image from local to cloudinary line 25 :: cloudinary.js :: \n", error.message);
        return null;
        // we are returning null so that we can check if the image is uploaded or not
    }
}

export { uploadToCloudinary }