import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../config";
const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save login data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      // Go to resume upload first
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">

      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900">

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
