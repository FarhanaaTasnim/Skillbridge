import multer from "multer";

const storage = multer.memoryStorage();

// Only allow PDFs — check both the MIME type the browser reports
// AND the file extension, since MIME type can be spoofed by the client.
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];
  const allowedExtensions = /\.pdf$/i;

  const hasValidMime = allowedMimeTypes.includes(file.mimetype);
  const hasValidExtension = allowedExtensions.test(file.originalname);

  if (hasValidMime && hasValidExtension) {
    return cb(null, true);
  }

  // Reject with a recognizable error so the controller/route can
  // return a clean 400 instead of a raw Multer stack trace.
  const error = new Error("INVALID_FILE_TYPE");
  error.code = "INVALID_FILE_TYPE";
  cb(error, false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

export default upload;