import axios from "axios";

// 🔧 Normalize function (fix matching issue)
const normalize = (str) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(".", "")
    .replace("js", "");
};

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];

    const response = await axios.get("https://remoteok.com/api");

    const jobs = response.data.slice(1).map((job) => {

      const tags = job.tags || [];

      // Normalize user skills
      const normalizedUserSkills = userSkills.map((skill) =>
        normalize(skill)
      );

      // Match logic
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
        company: job.company || "Unknown Company",
        location: job.location || "Remote",
        tags,
        matchScore,
        missingSkills,

        // ✅ APPLY LINK FIXED HERE
        apply_link: job.url || job.apply_url || "https://remoteok.com"
      };
    });

    res.json(jobs);

  } catch (error) {
    console.error("Job fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};