import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      secure: true,
    });

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, () => {});
    }
    // fs.unlinkSync(localFilePath);
    console.error("Error uploading file on cloudinary.", error?.message);
    return null;
  }
};
