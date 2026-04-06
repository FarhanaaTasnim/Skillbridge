import axios from "axios";

const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\.\-\_]/g, "")
    .replace("javascript", "js")
    .replace("nodejs", "node")
    .replace("reactjs", "react")
    .replace("vuejs", "vue")
    .replace("expressjs", "express");
};

const skillMatches = (userSkill, jobTag) => {
  const ns = normalize(userSkill);
  const nt = normalize(jobTag);
  return nt.includes(ns) || ns.includes(nt);
};

const calculateMatch = (userSkills, tags, title = "", description = "") => {
  // if no tags, try matching against title and description
  if (!tags || tags.length === 0) {
    const combinedText = (title + " " + description).toLowerCase();
    const matched = userSkills.filter(skill =>
      combinedText.includes(normalize(skill))
    );

    const matchScore = userSkills.length > 0
      ? Math.round((matched.length / userSkills.length) * 100)
      : 0;

    const missingSkills = userSkills.filter(skill =>
      !combinedText.includes(normalize(skill))
    );

    return { matchScore, missingSkills };
  }

  const matched = tags.filter(tag =>
    userSkills.some(skill => skillMatches(skill, tag))
  );

  const missingSkills = tags.filter(tag =>
    !userSkills.some(skill => skillMatches(skill, tag))
  );

  const matchScore = Math.round((matched.length / tags.length) * 100);

  return { matchScore, missingSkills };
};

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];

    if (userSkills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    console.log("User skills received:", userSkills);

    let jobs = [];

    // Try Jobicy
    try {
      const response = await axios.get(
        "https://jobicy.com/api/v2/remote-jobs?count=50",
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 15000
        }
      );

      if (response.data && Array.isArray(response.data.jobs)) {
        jobs = response.data.jobs.map(job => {
          let tags = [];

          if (Array.isArray(job.jobTags)) {
            tags = job.jobTags;
          } else if (typeof job.jobTags === "string" && job.jobTags) {
            tags = job.jobTags.split(",").map(t => t.trim()).filter(Boolean);
          } else if (Array.isArray(job.tags)) {
            tags = job.tags;
          } else if (typeof job.tags === "string" && job.tags) {
            tags = job.tags.split(",").map(t => t.trim()).filter(Boolean);
          }

          // also extract skills from job title and description
          const titleWords = (job.jobTitle || "").toLowerCase().split(/\s+/);
          const knownSkills = [
            "react", "node", "python", "java", "javascript",
            "typescript", "mongodb", "sql", "docker", "aws",
            "vue", "angular", "express", "django", "php",
            "css", "html", "graphql", "redis", "kubernetes"
          ];

          const titleSkills = knownSkills.filter(skill =>
            titleWords.some(word => word.includes(skill))
          );

          // merge tags with title skills
          const allTags = [...new Set([...tags, ...titleSkills])];

          console.log(`Job: ${job.jobTitle} | Tags: ${allTags}`);

          const { matchScore, missingSkills } = calculateMatch(
  userSkills,
  allTags,
  job.title || "",
  job.description || ""
);

          return {
            title: job.jobTitle || "No Title",
            company: job.companyName || "Unknown",
            location: job.jobGeo || "Remote",
            tags: allTags,
            matchScore,
            missingSkills,
            apply_link: job.url || "https://jobicy.com"
          };
        });

        console.log("Jobicy jobs fetched:", jobs.length);
      }
    } catch (err) {
      console.log("Jobicy failed:", err.message);
    }

    // Fallback to Arbeitnow
    if (jobs.length === 0) {
      try {
        const response = await axios.get(
          "https://www.arbeitnow.com/api/job-board-api",
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          jobs = response.data.data.slice(0, 50).map(job => {
            let tags = [];

            if (Array.isArray(job.tags)) {
              tags = job.tags;
            } else if (typeof job.tags === "string" && job.tags) {
              tags = job.tags.split(",").map(t => t.trim()).filter(Boolean);
            }

            const titleWords = (job.title || "").toLowerCase().split(/\s+/);
            const knownSkills = [
              "react", "node", "python", "java", "javascript",
              "typescript", "mongodb", "sql", "docker", "aws",
              "vue", "angular", "express", "django", "php",
              "css", "html", "graphql", "redis", "kubernetes"
            ];

            const titleSkills = knownSkills.filter(skill =>
              titleWords.some(word => word.includes(skill))
            );

            const allTags = [...new Set([...tags, ...titleSkills])];

            console.log(`Job: ${job.title} | Tags: ${allTags}`);

            const { matchScore, missingSkills } = calculateMatch(
  userSkills,
  allTags,
  job.title || "",
  job.description || ""
);

            return {
              title: job.title || "No Title",
              company: job.company_name || "Unknown",
              location: job.location || "Remote",
              tags: allTags,
              matchScore,
              missingSkills,
              apply_link: job.url || "https://arbeitnow.com"
            };
          });

          console.log("Arbeitnow jobs fetched:", jobs.length);
        }
      } catch (err) {
        console.log("Arbeitnow failed:", err.message);
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