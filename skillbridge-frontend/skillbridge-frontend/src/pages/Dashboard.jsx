import { useNavigate } from "react-router-dom";
import API_URL from "../config";
const Dashboard = () => {

  const navigate = useNavigate();

  const handleJobsClick = () => {
    const skills = localStorage.getItem("skills");

    if (!skills) {
      alert("Please upload your resume first.");
      navigate("/resume");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold mb-10">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">

        {/* Upload Resume */}
        <div
          onClick={() => navigate("/resume")}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">
            📄 Upload Resume
          </h2>
          <p className="text-gray-600">
            Upload or update your resume
          </p>
        </div>

        {/* View Jobs */}
        <div
          onClick={handleJobsClick}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">
            💼 View Recommended Jobs
          </h2>
          <p className="text-gray-600">
            Jobs based on your skills
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white hover:scale-105 transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">
            👤 Profile
          </h2>
          <p className="text-gray-600">
            View your details
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;