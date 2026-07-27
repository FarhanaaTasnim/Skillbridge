import express from "express";
import upload from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";
import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

// Wrap the multer middleware so we can turn its errors into clean JSON
const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          message: "Only PDF files are allowed.",
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File is too large. Maximum size is 5MB.",
        });
      }
      return res.status(400).json({ message: err.message || "Upload failed" });
    }
    next();
  });
};

router.post("/upload", protect, handleUpload, uploadResume);

export default router;