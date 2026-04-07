import axios from "axios";

/* ---------------- NORMALIZATION ---------------- */
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

/* ---------------- SKILL MATCH ---------------- */
const skillMatches = (userSkill, jobTag) => {
  const ns = normalize(userSkill);
  const nt = normalize(jobTag);
  return nt.includes(ns) || ns.includes(nt);
};

/* ---------------- SKILL GROUPS ---------------- */
const skillGroups = {
  mern: ["mongo", "express", "react", "node"],
  frontend: ["react", "vue", "angular", "css", "html"],
  backend: ["node", "django", "express", "php"],
  devops: ["docker", "kubernetes", "aws"],
};

/* ---------------- SKILL EXPANSION ---------------- */
const expandSkills = (skills) => {
  let expanded = [...skills];

  skills.forEach((skill) => {
    const key = normalize(skill);
    if (skillGroups[key]) {
      expanded.push(...skillGroups[key]);
    }
  });

  return [...new Set(expanded)];
};

/* ---------------- SKILL WEIGHTS ---------------- */
const skillWeights = {
  react: 3,
  node: 3,
  js: 3,
  typescript: 3,
  python: 3,
  java: 3,

  mongodb: 2,
  sql: 2,
  docker: 2,
  aws: 2,
  express: 2,
  django: 2,

  css: 1,
  html: 1,
};

/* ---------------- MATCH CALCULATION ---------------- */
const calculateMatch = (
  userSkills,
  tags,
  title = "",
  description = ""
) => {
  const expandedUserSkills = expandSkills(userSkills);

  // Fallback when no tags
  if (!tags || tags.length === 0) {
    const combinedText = (title + " " + description).toLowerCase();

    const matched = expandedUserSkills.filter((skill) =>
      combinedText.includes(normalize(skill))
    );

    const matchScore = expandedUserSkills.length
      ? Math.round((matched.length / expandedUserSkills.length) * 100)
      : 0;

    const missingSkills = expandedUserSkills.filter(
      (skill) => !combinedText.includes(normalize(skill))
    );

    return {
      matchScore,
      missingSkills,
      matchReason: `Matched ${matched.length} skills from description`,
      hasRealTags: false,
    };
  }

  let totalWeight = 0;
  let matchedWeight = 0;
  let matchedSkills = [];

  tags.forEach((tag) => {
    const normalizedTag = normalize(tag);
    const weight = skillWeights[normalizedTag] || 1;

    totalWeight += weight;

    if (
      expandedUserSkills.some((skill) => skillMatches(skill, tag))
    ) {
      matchedWeight += weight;
      matchedSkills.push(tag);
    }
  });

  const missingSkills = tags.filter(
    (tag) =>
      !expandedUserSkills.some((skill) =>
        skillMatches(skill, tag)
      )
  );

  const matchScore = totalWeight
    ? Math.round((matchedWeight / totalWeight) * 100)
    : 0;

  return {
    matchScore,
    missingSkills,
    matchReason:
      matchedSkills.length > 0
        ? `Strong match in ${matchedSkills.slice(0, 3).join(", ")}`
        : "Low match",
    skillGapAnalysis: {
      critical: missingSkills.slice(0, 3),
      suggestion:
        missingSkills.length > 0
          ? `Learn ${missingSkills.slice(0, 2).join(", ")} to improve`
          : "You're well matched!",
    },
    hasRealTags: true,
  };
};

/* ---------------- FETCH JOBS ---------------- */
export const fetchRemoteJobs = async (req, res) => {
  try {
    const userSkills = req.body.skills || [];

    if (userSkills.length === 0) {
      return res.status(400).json({
        message: "No skills provided",
      });
    }

    console.log("User skills:", userSkills);

    let jobs = [];

    /* ----------- JOBICY API ----------- */
    try {
      const response = await axios.get(
        "https://jobicy.com/api/v2/remote-jobs?count=50",
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 15000,
        }
      );

      if (response.data?.jobs) {
        jobs = response.data.jobs.map((job) => {
          let tags = [];

          if (Array.isArray(job.jobTags)) {
            tags = job.jobTags;
          } else if (typeof job.jobTags === "string") {
            tags = job.jobTags.split(",").map((t) => t.trim());
          }

          const knownSkills = [
            "react","node","python","java","javascript",
            "typescript","mongodb","sql","docker","aws",
            "vue","angular","express","django","php",
            "css","html","graphql","redis","kubernetes",
          ];

          const titleWords = (job.jobTitle || "")
            .toLowerCase()
            .split(/\s+/);

          const titleSkills = knownSkills.filter((skill) =>
            titleWords.some((word) => word.includes(skill))
          );

          const allTags = [...new Set([...tags, ...titleSkills])];

          const matchData = calculateMatch(
            userSkills,
            allTags,
            job.jobTitle,
            job.jobDescription
          );

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

    /* ----------- FALLBACK: ARBEITNOW ----------- */
    if (jobs.length === 0) {
      try {
        const response = await axios.get(
          "https://www.arbeitnow.com/api/job-board-api",
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000,
          }
        );

        if (response.data?.data) {
          jobs = response.data.data.slice(0, 50).map((job) => {
            let tags = Array.isArray(job.tags)
              ? job.tags
              : [];

            const knownSkills = [
              "react","node","python","java","javascript",
              "typescript","mongodb","sql","docker","aws",
              "vue","angular","express","django","php",
              "css","html","graphql","redis","kubernetes",
            ];

            const titleWords = (job.title || "")
              .toLowerCase()
              .split(/\s+/);

            const titleSkills = knownSkills.filter((skill) =>
              titleWords.some((word) => word.includes(skill))
            );

            const allTags = [...new Set([...tags, ...titleSkills])];

            const matchData = calculateMatch(
              userSkills,
              allTags,
              job.title,
              job.description
            );

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
      return res.status(500).json({
        message: "All job APIs failed",
      });
    }

    /* ----------- SORT ----------- */
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(jobs);

  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};