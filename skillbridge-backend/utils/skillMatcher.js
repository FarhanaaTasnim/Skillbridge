const skillMap = {
  js: "javascript",
  "node.js": "node",
  reactjs: "react",
  ml: "machine learning",
  ai: "artificial intelligence"
};

function normalize(skill) {
  skill = skill.toLowerCase().trim();
  return skillMap[skill] || skill;
}

function analyzeSkills(userSkills, jobSkills) {
  const normalizedUser = userSkills.map(normalize);
  const normalizedJob = jobSkills.map(normalize);

  const matched = [];
  const missing = [];

  normalizedJob.forEach(skill => {
    if (normalizedUser.includes(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const matchPercent = Math.round(
    (matched.length / normalizedJob.length) * 100
  );

  return {
    matchPercent,
    matchedSkills: matched,
    missingSkills: missing
  };
}

export { analyzeSkills };