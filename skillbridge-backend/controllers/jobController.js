import axios from "axios";

const normalize = (str) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace("js", "");
};

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];

    // Try Jobicy first
    let jobs = [];

    try {
      const response = await axios.get("https://jobicy.com/api/v2/remote-jobs?count=50", {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data.jobs)) {
        jobs = response.data.jobs.map(job => {
          const tags = Array.isArray(job.jobTags) ? job.jobTags : [];

          const normalizedUserSkills = userSkills.map(s => normalize(s));

          const matched = tags.filter(tag =>
            normalizedUserSkills.some(skill => normalize(tag).includes(skill))
          );

          const missingSkills = tags.filter(tag =>
            !normalizedUserSkills.some(skill => normalize(tag).includes(skill))
          );

          const matchScore = tags.length > 0
            ? Math.round((matched.length / tags.length) * 100)
            : 0;

          return {
            title: job.jobTitle || "No Title",
            company: job.companyName || "Unknown",
            location: job.jobGeo || "Remote",
            tags,
            matchScore,
            missingSkills,
            apply_link: job.url || "https://jobicy.com"
          };
        });
      }
    } catch (err) {
      console.log("Jobicy failed, trying Arbeitnow...");
    }

    // Fallback to Arbeitnow if Jobicy fails
    if (jobs.length === 0) {
      try {
        const response = await axios.get("https://www.arbeitnow.com/api/job-board-api", {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 10000
        });

        if (response.data && Array.isArray(response.data.data)) {
          jobs = response.data.data.slice(0, 50).map(job => {
            const tags = Array.isArray(job.tags) ? job.tags : [];

            const normalizedUserSkills = userSkills.map(s => normalize(s));

            const matched = tags.filter(tag =>
              normalizedUserSkills.some(skill => normalize(tag).includes(skill))
            );

            const missingSkills = tags.filter(tag =>
              !normalizedUserSkills.some(skill => normalize(tag).includes(skill))
            );

            const matchScore = tags.length > 0
              ? Math.round((matched.length / tags.length) * 100)
              : 0;

            return {
              title: job.title || "No Title",
              company: job.company_name || "Unknown",
              location: job.location || "Remote",
              tags,
              matchScore,
              missingSkills,
              apply_link: job.url || "https://arbeitnow.com"
            };
          });
        }
      } catch (err) {
        console.log("Arbeitnow also failed:", err.message);
      }
    }

    if (jobs.length === 0) {
      return res.status(500).json({ message: "All job APIs failed" });
    }

    // Sort by best match
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(jobs);

  } catch (error) {
    console.error("Job fetch error:", error.message);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};