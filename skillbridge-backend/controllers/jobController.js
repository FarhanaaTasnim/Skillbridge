import axios from "axios";
import { calculateMatch, extractSkillsFromText, SKILL_DATABASE } from "../utils/skills.js";

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];
    if (userSkills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    let jobs = [];

    try {
      const response = await axios.get(
        "https://jobicy.com/api/v2/remote-jobs?count=50",
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }
      );

      if (response.data?.jobs) {
        jobs = response.data.jobs.map((job) => {
          let tags = Array.isArray(job.jobTags)
            ? job.jobTags
            : typeof job.jobTags === "string"
            ? job.jobTags.split(",").map((t) => t.trim())
            : [];

          const titleSkills = extractSkillsFromText(job.jobTitle || "", SKILL_DATABASE);
          const allTags = [...new Set([...tags, ...titleSkills])];
          const matchData = calculateMatch(userSkills, allTags, job.jobTitle, job.jobDescription);

          return {
            title: job.jobTitle || "No Title",
            company: job.companyName || "Unknown",
            location: job.jobGeo || "Remote",
            tags: allTags,
            ...matchData,
            apply_link: job.url,
          };
        });
      }
    } catch (err) {
      console.log("Jobicy failed:", err.message);
    }

    if (jobs.length === 0) {
      try {
        const response = await axios.get(
          "https://www.arbeitnow.com/api/job-board-api",
          { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }
        );

        if (response.data?.data) {
          jobs = response.data.data.slice(0, 50).map((job) => {
            const tags = Array.isArray(job.tags) ? job.tags : [];
            const titleSkills = extractSkillsFromText(job.title || "", SKILL_DATABASE);
            const allTags = [...new Set([...tags, ...titleSkills])];
            const matchData = calculateMatch(userSkills, allTags, job.title, job.description);

            return {
              title: job.title,
              company: job.company_name,
              location: job.location,
              tags: allTags,
              ...matchData,
              apply_link: job.url,
            };
          });
        }
      } catch (err) {
        console.log("Arbeitnow failed:", err.message);
      }
    }

    if (jobs.length === 0) {
      return res.status(500).json({ message: "All job APIs failed" });
    }

    jobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json(jobs);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};