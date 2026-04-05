import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(req.file.buffer)
    });

    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text += content.items.map(item => item.str).join(" ");

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
      "data science"
    ];

    const detectedSkills = skillDatabase.filter(skill =>
      text.includes(skill)
    );

    res.json({
      message: "Resume processed successfully",
      skills: detectedSkills.map(s => s.toLowerCase())
    });

  } catch (error) {

    console.error("Resume parsing error:", error);

    res.status(500).json({
      message: "Resume parsing failed",
      error: error.message
    });

  }
};