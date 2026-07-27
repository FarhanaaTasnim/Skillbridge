import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { useAuth } from "../context/AuthContext.jsx";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, skills, updateSkills, logout } = useAuth();

  const hasResume = skills.length > 0;

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    if (!token) {
      alert("You must be logged in to upload a resume.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        logout();
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const data = await res.json();

      console.log("Backend response:", data);

      if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        updateSkills(data.skills);
        alert("✅ Resume uploaded & skills saved!");
        navigate("/jobs");
      } else {
        alert(data.message || "❌ No skills detected. Try another resume.");
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900">

        <h2 className="text-3xl font-bold text-center mb-6">
          Upload Resume
        </h2>

        {hasResume && (
          <p className="text-green-600 text-center mb-4">
            ✅ Resume already uploaded (you can update it)
          </p>
        )}

        <form onSubmit={handleUpload} className="space-y-5">

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:opacity-60"
          >
            {loading ? "Processing..." : hasResume ? "Update Resume" : "Upload Resume"}
          </button>

        </form>

        {hasResume && (
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 w-full py-2 border border-purple-600 text-purple-600 rounded-lg"
          >
            Skip → View Jobs
          </button>
        )}

      </div>
    </div>
  );
};

export default Resume;