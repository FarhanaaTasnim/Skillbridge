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

    const response = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 10000
    });

    // make sure response is array
    if (!Array.isArray(response.data)) {
      return res.status(500).json({ message: "Invalid data from job API" });
    }

    const jobs = response.data
      .slice(1)
      .filter(job => job && job.position) // remove empty entries
      .map((job) => {
        const tags = Array.isArray(job.tags) ? job.tags : [];

        const normalizedUserSkills = userSkills.map((skill) =>
          normalize(skill)
        );

        const matched = tags.filter((tag) => {
          const normalizedTag = normalize(tag);
          return normalizedUserSkills.some((skill) =>
            normalizedTag.includes(skill)
          );
        });

        const missingSkills = tags.filter((tag) => {
          const normalizedTag = normalize(tag);
          return !normalizedUserSkills.some((skill) =>
            normalizedTag.includes(skill)
          );
        });

        const matchScore =
          tags.length > 0
            ? Math.round((matched.length / tags.length) * 100)
            : 0;

        return {
          title: job.position || "No Title",
          company: job.company || "Unknown",
          location: job.location || "Remote",
          tags,
          matchScore,
          missingSkills,
          apply_link: job.url || "https://remoteok.com"
        };
      });

    res.json(jobs);

  } catch (error) {
    console.error("Job fetch error:", error.message);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};