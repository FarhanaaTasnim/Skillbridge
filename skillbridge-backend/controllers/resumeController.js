import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { extractSkillsFromText } from "../utils/skills.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // basic validation (see item 5 below)
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are supported" });
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

    const detectedSkills = extractSkillsFromText(text);

    if (detectedSkills.length === 0) {
      return res.status(422).json({
        message: "No recognizable skills found in this resume",
        skills: [],
      });
    }

    res.json({
      message: "Resume processed successfully",
      skills: detectedSkills,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);
    res.status(500).json({
      message: "Resume parsing failed",
      error: error.message,
    });
  }
};