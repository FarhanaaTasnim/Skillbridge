import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasSkills } = useAuth();

  const handleJobsClick = () => {
    if (!hasSkills) {
      alert("Please upload your resume first.");
      navigate("/resume");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold mb-10 text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">

        {/* Upload Resume */}
        <div
          onClick={() => navigate("/resume")}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            📄 Upload Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload or update your resume
          </p>
        </div>

        {/* View Jobs */}
        <div
          onClick={handleJobsClick}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            💼 View Recommended Jobs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Jobs based on your skills
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            👤 Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View your details
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;