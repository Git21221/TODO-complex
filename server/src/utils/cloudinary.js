import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudianry = async (filepath) => {
  console.log(filepath);
  if (!filepath) return null;
  try {
    const uploadedOnCloudinary = await cloudinary.uploader.upload(filepath);
    if (uploadedOnCloudinary?.secure_url) {
      fs.unlinkSync(filepath);
      return uploadedOnCloudinary;
    }
  } catch (error) {
    // fs.unlinkSync(filepath);
    return null;
  }
};

export { uploadOnCloudianry };
