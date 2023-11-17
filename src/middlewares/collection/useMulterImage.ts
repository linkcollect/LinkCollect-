import { Request, Response, NextFunction } from "express";
import  User  from "../../models/user";
import CollectionModel from "../../models/collection";
import multer from "multer";
import { storage } from "../../cloudinary";
import { storageS3 } from "../../cloudinary/aws";
import env from "../../config/index";


console.log("is aws",env.isS3);
const upload = multer({
  storage: env.isS3 === true ? storageS3 : storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 5 MB (you can adjust this limit as needed)
  },
});

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const useImageUploader = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    upload.single("image")(req, res, (uploadError) => {
        if (uploadError) {
          console.log(uploadError);
          // Handle the upload error here
          return res.status(400).json({ error: 'File upload failed' });
        }
        next();
      });
   } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      err: "Error retrieving collection",
      data: {},
    });
  }
};

