import { Request, Response, NextFunction } from "express";
import  User  from "../../models/user";
import CollectionModel from "../../models/collection";
import multer from "multer";
import { storage } from "../../cloudinary";

const upload = multer({
  storage,
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

