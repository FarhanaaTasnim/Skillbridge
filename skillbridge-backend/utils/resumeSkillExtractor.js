const skillDatabase = [
  "javascript",
  "react",
  "node",
  "python",
  "java",
  "mongodb",
  "sql",
  "docker",
  "aws",
  "machine learning",
  "data science",
  "typescript",
  "next.js",
  "html",
  "css"
];

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();

  return skillDatabase.filter(skill =>
    lower.includes(skill)
  );
}

export default extractSkillsFromText;