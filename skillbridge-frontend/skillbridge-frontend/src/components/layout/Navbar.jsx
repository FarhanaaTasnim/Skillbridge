import { NavLink } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-full transition-all duration-300 ${
      isActive
        ? "bg-purple-500 text-white shadow-lg"
        : "text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-gray-700"
    }`;
    const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

  return (
    <header className="fixed-nav-bar">
    <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md fixed top-0 left-0 w-full z-50
  backdrop-blur-md
  bg-white/70 dark:bg-gray-900/70
  shadow-md fixed top-0 left-0 w-full z-50" >
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        SkillBridge
      </h1>

      <div className="flex items-center gap-4">
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/login" className={linkStyle}>
          Login
        </NavLink>
        <NavLink to="/register" className={linkStyle}>
          Register
        </NavLink>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      
    </nav>
    </header>
  );
};

export default Navbar;