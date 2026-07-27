import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Magic-byte check: real PDFs begin with "%PDF-" regardless of
// what extension or mimetype the client claims.
const isActuallyPDF = (buffer) => {
  if (!buffer || buffer.length < 5) return false;
  const header = buffer.subarray(0, 5).toString("ascii");
  return header === "%PDF-";
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Belt-and-suspenders: even though Multer's fileFilter should have
    // already rejected non-PDFs, verify the actual file content here too.
    if (!isActuallyPDF(req.file.buffer)) {
      return res.status(400).json({
        message: "Invalid file. Please upload a valid PDF resume.",
      });
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(req.file.buffer),
    });

    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ");
    }

    text = text.toLowerCase();

    const skillDatabase = [
      "javascript",
      "react",
      "node",
      "mongodb",
      "express",
      "python",
      "java",
      "sql",
      "typescript",
      "next.js",
      "docker",
      "aws",
      "machine learning",
      "data science",
    ];

    const detectedSkills = skillDatabase.filter((skill) => text.includes(skill));

    res.json({
      message: "Resume processed successfully",
      skills: detectedSkills.map((s) => s.toLowerCase()),
    });
  } catch (error) {
    console.error("Resume parsing error:", error.message);

    res.status(500).json({
      message: "Resume parsing failed. Please make sure the file is a valid, unencrypted PDF.",
      error: error.message,
    });
  }
};