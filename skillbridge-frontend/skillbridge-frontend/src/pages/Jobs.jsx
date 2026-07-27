import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState("high");

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const skillsRaw = localStorage.getItem("skills");

      if (!skillsRaw || skillsRaw === "undefined" || skillsRaw === "null") {
        navigate("/resume");
        return;
      }

      let skills;
      try {
        skills = JSON.parse(skillsRaw);
      } catch {
        navigate("/resume");
        return;
      }

      if (!Array.isArray(skills) || skills.length === 0) {
        navigate("/resume");
        return;
      }

      const res = await fetch(`${API_URL}/api/jobs/remote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills }),
      });

      if (res.status === 401) {
        localStorage.clear();
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
        setFilteredJobs(data);
      } else {
        setJobs([]);
        setFilteredJobs([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let sorted = [...jobs];

    if (sortType === "high") {
      sorted.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      sorted.sort((a, b) => a.matchScore - b.matchScore);
    }

    setFilteredJobs(sorted);
  }, [sortType, jobs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Finding your best matches...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchJobs}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-700 dark:text-gray-300">No jobs found </p>
        <button
          onClick={() => navigate("/resume")}
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recommended Jobs</h1>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition"
        >
          <option value="high">Best Match</option>
          <option value="low">Lowest Match</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  const matchColor =
    job.matchScore >= 70
      ? "text-green-500"
      : job.matchScore >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{job.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>

        <p className={`mt-2 font-semibold ${matchColor}`}>
          {job.matchScore}% Match
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {job.matchReason}
        </p>

        {job.skillGapAnalysis?.critical?.length > 0 && (
          <p className="text-xs text-red-400 dark:text-red-400/90 mt-2">
            Missing: {job.skillGapAnalysis.critical.join(", ")}
          </p>
        )}

        {job.skillGapAnalysis?.suggestion && (
          <p className="text-xs text-blue-400 dark:text-blue-300 mt-1">
            💡 {job.skillGapAnalysis.suggestion}
          </p>
        )}
      </div>

      <a href={job.apply_link} target="_blank" rel="noreferrer" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded transition">
        Apply
      </a>
    </div>
  );
};

export default Jobs;