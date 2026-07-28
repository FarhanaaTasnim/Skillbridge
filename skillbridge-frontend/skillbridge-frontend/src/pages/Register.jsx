import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="
        w-full max-w-md p-8 rounded-2xl shadow-xl
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-lg
        transition-all duration-500
      ">
        <h2 className="
          text-3xl font-bold text-center mb-6
          bg-gradient-to-r from-purple-600 to-pink-500
          bg-clip-text text-transparent
        ">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-purple-500
              outline-none transition
            "
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-purple-500
              outline-none transition
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-purple-500
              outline-none transition
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-lg font-semibold text-white
              bg-purple-600 hover:bg-purple-700
              transition transform hover:scale-[1.02]
              disabled:opacity-60
            "
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
