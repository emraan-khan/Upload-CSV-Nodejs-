import multer from "multer";
import path from "path";

// Configuring Multer storage
export const storage = multer.diskStorage({
    destination: 'uploads/', // Directory for uploaded files
    filename: (req, file, cb) => { // Naming convention for uploaded files
      cb(null, file.originalname);
    }
  });

