import axios from "axios";
import { calculateMatch, extractSkillsFromText, SKILL_DATABASE } from "../utils/skills.js";

// --- Simple in-memory cache for raw job listings ---
// Cached data is the SAME for every user (title, company, tags, description).
// Only the match scoring below (calculateMatch) differs per user's skills,
// so we cache before matching, not after.
let rawJobsCache = { data: null, source: null, timestamp: 0 };
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

async function fetchRawJobs() {
  const now = Date.now();
  const isCacheValid = 
    rawJobsCache.data && now - rawJobsCache.timestamp < CACHE_DURATION_MS;

  if (isCacheValid) {
    console.log(`Serving ${rawJobsCache.data.length} jobs from cache (source: ${rawJobsCache.source})`);
    return rawJobsCache;
  }

  // Cache miss or expired - hit the real APIs
  let rawJobs = [];
  let source = null;

  try {
    const response = await axios.get(
      "https://jobicy.com/api/v2/remote-jobs?count=50",
      { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }
    );

    if (response.data?.jobs) {
      rawJobs = response.data.jobs;
      source = "jobicy";
    }
  } catch (err) {
    console.log("Jobicy failed:", err.message);
  }

  if (rawJobs.length === 0) {
    try {
      const response = await axios.get(
        "https://www.arbeitnow.com/api/job-board-api",
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }
      );

      if (response.data?.data) {
        rawJobs = response.data.data.slice(0, 50);
        source = "arbeitnow";
      }
    } catch (err) {
      console.log("Arbeitnow failed:", err.message);
    }
  }

  if (rawJobs.length > 0) {
    rawJobsCache = { data: rawJobs, source, timestamp: now };
    console.log(`Fetched ${rawJobs.length} fresh jobs from ${source}, cached for ${CACHE_DURATION_MS / 1000}s`);
  }

  return { data: rawJobs, source };
}

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];
    if (userSkills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    const { data: rawJobs, source } = await fetchRawJobs();

    if (!rawJobs || rawJobs.length === 0) {
      return res.status(500).json({ message: "All job APIs failed" });
    }

    // Matching still runs fresh every request, using this user's real skills
    let jobs;
    if (source === "jobicy") {
      jobs = rawJobs.map((job) => {
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
    } else {
      jobs = rawJobs.map((job) => {
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

    jobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json(jobs);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};