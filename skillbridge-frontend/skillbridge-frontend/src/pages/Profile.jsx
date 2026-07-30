import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSkills = localStorage.getItem("skills");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedSkills && storedSkills !== "undefined") {
      setSkills(JSON.parse(storedSkills));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

      {/* Header Card */}
      <div className="
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        rounded-2xl p-6 sm:p-8 shadow-md mb-6
        text-center
      ">
        {/* Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4">
          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          {user?.name || "User"}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 break-words">
          {user?.email || "No email"}
        </p>

        <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
          Job Seeker
        </span>
      </div>

      {/* Info Card */}
      <div className="
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        rounded-2xl p-5 sm:p-6 shadow-md mb-6
      ">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          Account Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <span className="text-xl shrink-0">📧</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                {user?.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <span className="text-xl shrink-0">👤</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                {user?.name || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <span className="text-xl shrink-0">📄</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">Resume Status</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {skills.length > 0 ? "✅ Uploaded" : "❌ Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        rounded-2xl p-5 sm:p-6 shadow-md mb-6
      ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Your Skills
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {skills.length} detected
          </span>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="
                  bg-purple-100 dark:bg-purple-900/40
                  text-purple-700 dark:text-purple-300
                  border border-purple-200 dark:border-purple-700
                  text-sm px-3 py-1 rounded-full font-medium
                "
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">
              No skills detected yet.
            </p>
            <button
              onClick={() => navigate("/resume")}
              className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
            >
              Upload resume to detect skills →
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => navigate("/resume")}
          className="
            py-3 rounded-xl font-semibold
            border-2 border-purple-600 dark:border-purple-500
            text-purple-600 dark:text-purple-400
            hover:bg-purple-600 hover:text-white
            dark:hover:bg-purple-600 dark:hover:text-white
            transition duration-200
          "
        >
          Update Resume
        </button>

        <button
          onClick={handleLogout}
          className="
            py-3 rounded-xl font-semibold
            bg-red-500 hover:bg-red-600
            dark:bg-red-600 dark:hover:bg-red-700
            text-white transition duration-200
          "
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;