import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
const Resume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  const navigate = useNavigate();

  // Check if skills already exist
  useEffect(() => {
    const skills = localStorage.getItem("skills");

    if (skills && skills !== "undefined") {
      setHasResume(true);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Backend response:", data);

      // ✅ SAFE SAVE
      if (data.skills && Array.isArray(data.skills)) {
        localStorage.setItem("skills", JSON.stringify(data.skills));
        setHasResume(true);
        alert("✅ Resume uploaded & skills saved!");
        navigate("/jobs");
      } else {
        alert("❌ No skills detected. Try another resume.");
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
            className="w-full py-3 bg-purple-600 text-white rounded-lg"
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