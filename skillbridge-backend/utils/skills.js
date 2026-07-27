// skillbridge-backend/utils/skills.js
// Single source of truth for skill detection, normalization, and matching.

export const SKILL_DATABASE = [
  "javascript", "typescript", "react", "node", "python", "java",
  "docker", "aws", "mongodb", "sql", "next.js", "html", "css",
  "express", "django", "php", "vue", "angular", "graphql",
  "redis", "kubernetes", "machine learning", "data science",
];

const ALIASES = {
  js: "javascript",
  "node.js": "node",
  nodejs: "node",
  reactjs: "react",
  vuejs: "vue",
  expressjs: "express",
  ml: "machine learning",
  ai: "artificial intelligence",
};

export function normalizeSkill(skill) {
  const s = (skill || "").toLowerCase().trim();
  return ALIASES[s] || s;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Word-boundary aware substring check.
 * Fixes the "java" matching inside "javascript" bug —
 * plain `.includes()` can't tell "java" from "javascript",
 * this can, because it requires a non-alphanumeric char (or
 * string edge) on both sides of the match.
 */
export function textContainsSkill(text, skill) {
  const pattern = new RegExp(
    `(?<![a-z0-9])${escapeRegex(skill.toLowerCase())}(?![a-z0-9])`,
    "i"
  );
  return pattern.test(text);
}

export function extractSkillsFromText(text, skillList = SKILL_DATABASE) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return skillList.filter((skill) => textContainsSkill(lower, skill));
}

/* ---------------- MATCHING (used by /api/jobs/remote) ---------------- */

const SKILL_GROUPS = {
  mern: ["mongo", "express", "react", "node"],
  frontend: ["react", "vue", "angular", "css", "html"],
  backend: ["node", "django", "express", "php"],
  devops: ["docker", "kubernetes", "aws"],
};

const SKILL_WEIGHTS = {
  react: 3, node: 3, js: 3, javascript: 3, typescript: 3, python: 3, java: 3,
  mongodb: 2, sql: 2, docker: 2, aws: 2, express: 2, django: 2,
  css: 1, html: 1,
};

const compact = (str) =>
  (str || "").toLowerCase().trim().replace(/[\s.\-_]/g, "");

export function expandSkills(skills) {
  const expanded = [...skills];
  skills.forEach((skill) => {
    const key = compact(normalizeSkill(skill));
    if (SKILL_GROUPS[key]) expanded.push(...SKILL_GROUPS[key]);
  });
  return [...new Set(expanded)];
}

function skillMatches(userSkill, jobTag) {
  const a = compact(normalizeSkill(userSkill));
  const b = compact(normalizeSkill(jobTag));
  return a === b || a.includes(b) || b.includes(a);
}

export function calculateMatch(userSkills, tags, title = "", description = "") {
  const expandedUserSkills = expandSkills(userSkills);

  if (!tags || tags.length === 0) {
    const combinedText = `${title} ${description}`;
    const matched = expandedUserSkills.filter((skill) =>
      textContainsSkill(combinedText, skill)
    );
    const matchScore = expandedUserSkills.length
      ? Math.round((matched.length / expandedUserSkills.length) * 100)
      : 0;
    const missingSkills = expandedUserSkills.filter(
      (skill) => !textContainsSkill(combinedText, skill)
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
  const matchedSkills = [];

  tags.forEach((tag) => {
    const weight = SKILL_WEIGHTS[compact(normalizeSkill(tag))] || 1;
    totalWeight += weight;
    if (expandedUserSkills.some((skill) => skillMatches(skill, tag))) {
      matchedWeight += weight;
      matchedSkills.push(tag);
    }
  });

  const missingSkills = tags.filter(
    (tag) => !expandedUserSkills.some((skill) => skillMatches(skill, tag))
  );

  return {
    matchScore: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
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
}