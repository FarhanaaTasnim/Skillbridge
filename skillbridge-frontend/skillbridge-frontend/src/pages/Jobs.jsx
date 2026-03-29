import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const skillsRaw = localStorage.getItem("skills");

        if (!skillsRaw || skillsRaw === "undefined") {
          alert("Please upload your resume first.");
          navigate("/resume");
          return;
        }

        const skills = JSON.parse(skillsRaw);

        const res = await fetch(`${API_URL}/api/jobs/remote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills }),
        });

        const data = await res.json();
        if (Array.isArray(data)) {
  setJobs(data);
} else {
  console.error("Unexpected response:", data);
  setJobs([]);
}
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding your best matches...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
        <div>
          <p className="text-5xl mb-4">😢</p>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No Jobs Found</h2>
          <p className="text-gray-500 dark:text-gray-400">Try uploading a different resume.</p>
          <button
            onClick={() => navigate("/resume")}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Recommended Jobs
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {jobs.length} jobs matched based on your skills
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  const matchColor =
    job.matchScore >= 70
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      : job.matchScore >= 40
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
      : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";

  const barColor =
    job.matchScore >= 70
      ? "bg-gradient-to-r from-green-400 to-emerald-500"
      : job.matchScore >= 40
      ? "bg-gradient-to-r from-yellow-400 to-orange-400"
      : "bg-gradient-to-r from-red-400 to-rose-500";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {job.company?.[0] || "?"}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${matchColor}`}>
            {job.matchScore}% match
          </span>
        </div>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
          {job.title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {job.company}
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          📍 {job.location || "Remote"}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Skill Match</span>
            <span>{job.matchScore}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${job.matchScore}%` }}
            ></div>
          </div>
        </div>

        {job.missingSkills?.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {job.missingSkills.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {job.missingSkills.length > 4 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 px-1 py-0.5">
                  +{job.missingSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-green-600 dark:text-green-400 mb-4 font-medium">
            🎉 You match all required skills!
          </p>
        )}
      </div>

      <a
        href={job.apply_link || "#"}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block text-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-2.5 rounded-xl transition duration-200"
      >
        Apply Now →
      </a>
    </div>
  );
};

export default Jobs;
 