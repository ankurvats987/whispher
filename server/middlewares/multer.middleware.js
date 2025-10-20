import multer from "multer";
import path from "path";
import os from "os";

// const filePath = path.join(process.cwd(), "public", "temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, filePath);
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({
  storage,
});
