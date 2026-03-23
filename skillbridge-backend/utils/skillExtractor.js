const knownSkills = [
  "javascript",
  "react",
  "node",
  "python",
  "java",
  "docker",
  "aws",
  "mongodb",
  "sql",
  "typescript",
  "next.js",
  "machine learning",
  "data science"
];

function extractSkills(text) {
  const lower = text.toLowerCase();

  return knownSkills.filter(skill => lower.includes(skill));
}

export { extractSkills };