import axios from "axios";

const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/\-/g, "")
    .replace("javascript", "js")
    .replace("nodejs", "node")
    .replace("reactjs", "react");
};

const calculateMatch = (userSkills, tags) => {
  if (!tags || tags.length === 0) {
    return {matchScore: 0, missingSkills: tags || []};
  }

  const normalizedUserSkills = userSkills.map((s) => normalize(s));

  const matched = tags.filter((tag) =>
    normalizedUserSkills.some((skill) => {
      const normalizedTag = normalize(tag);
      return normalizedTag.includes(skill) || skill.includes(normalizedTag);
    }),
  );

  const missingSkills = tags.filter(
    (tag) =>
      !normalizedUserSkills.some((skill) => {
        const normalizedTag = normalize(tag);
        return normalizedTag.includes(skill) || skill.includes(normalizedTag);
      }),
  );

  const matchScore = Math.round((matched.length / tags.length) * 100);

  return {matchScore, missingSkills};
};

export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];

    if (userSkills.length === 0) {
      return res.status(400).json({message: "No skills provided"});
    }

    let jobs = [];

    // Try Jobicy
    try {
      const response = await axios.get(
        "https://jobicy.com/api/v2/remote-jobs?count=50",
        {
          headers: {"User-Agent": "Mozilla/5.0"},
          timeout: 10000,
        },
      );

      console.log("Jobicy response keys:", Object.keys(response.data));

      if (response.data && Array.isArray(response.data.jobs)) {
        jobs = response.data.jobs.map((job) => {
          // Jobicy uses jobTags as a string sometimes, handle both
          let tags = [];
          if (Array.isArray(job.jobTags)) {
            tags = job.jobTags;
          } else if (typeof job.jobTags === "string") {
            tags = job.jobTags.split(",").map((t) => t.trim());
          } else if (Array.isArray(job.tags)) {
            tags = job.tags;
          }

          console.log("Job tags for", job.jobTitle, ":", tags);
          console.log("Tags:", tags, "| User Skills:", userSkills);
          const {matchScore, missingSkills} = calculateMatch(userSkills, tags);

          return {
            title: job.jobTitle || "No Title",
            company: job.companyName || "Unknown",
            location: job.jobGeo || "Remote",
            tags,
            matchScore,
            missingSkills,
            apply_link: job.url || "https://jobicy.com",
          };
        });
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
            headers: {"User-Agent": "Mozilla/5.0"},
            timeout: 10000,
          },
        );

        console.log("Arbeitnow response keys:", Object.keys(response.data));

        if (response.data && Array.isArray(response.data.data)) {
          jobs = response.data.data.slice(0, 50).map((job) => {
            let tags = [];
            if (Array.isArray(job.tags)) {
              tags = job.tags;
            } else if (typeof job.tags === "string") {
              tags = job.tags.split(",").map((t) => t.trim());
            }

            console.log("Job tags for", job.title, ":", tags);

            const {matchScore, missingSkills} = calculateMatch(
              userSkills,
              tags,
            );

            return {
              title: job.title || "No Title",
              company: job.company_name || "Unknown",
              location: job.location || "Remote",
              tags,
              matchScore,
              missingSkills,
              apply_link: job.url || "https://arbeitnow.com",
            };
          });
        }
      } catch (err) {
        console.log("Arbeitnow failed:", err.message);
      }
    }

    if (jobs.length === 0) {
      return res.status(500).json({message: "All job APIs failed"});
    }

    // Sort by best match first
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(jobs);
  } catch (error) {
    console.error("Job fetch error:", error.message);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  const res = await fetch(`${API_URL}/api/jobs/remote`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({skills}),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  
};
