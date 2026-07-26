import express from "express";
import axios from "axios";
import protect from "../middleware/authMiddleware.js";
import { analyzeSkills } from "../utils/skillMatcher.js";
import { extractSkills } from "../utils/skillExtractor.js";
import { fetchRemoteJobs } from "../controllers/jobController.js";

const router = express.Router();

router.post("/remote", protect, fetchRemoteJobs);

router.get("/search", protect, async (req, res) => {
  try {
    const userSkills = req.query.skills?.split(",") || [];

    const response = await axios.get("https://remoteok.com/api");
    const jobs = response.data.slice(1);

    const processedJobs = jobs.map((job) => {
      const text = job.position + " " + job.description;
      const jobSkills = extractSkills(text);
      const analysis = analyzeSkills(userSkills, jobSkills);

      return {
        title: job.position,
        company: job.company,
        location: job.location,
        url: job.url,
        match: analysis.matchPercent,
        missingSkills: analysis.missingSkills,
      };
    });

    processedJobs.sort((a, b) => b.match - a.match);
    res.json(processedJobs.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

export default router;