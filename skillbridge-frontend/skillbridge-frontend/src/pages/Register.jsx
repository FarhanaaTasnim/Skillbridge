import { Link } from "react-router-dom";

const Register = () => {
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

        <form className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
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
            className="
              w-full py-3 rounded-lg font-semibold text-white
              bg-purple-600 hover:bg-purple-700
              transition transform hover:scale-[1.02]
            "
          >
            Register
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