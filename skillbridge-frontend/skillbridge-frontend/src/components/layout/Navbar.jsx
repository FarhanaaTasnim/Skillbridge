import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Re-check auth whenever the route changes (covers login/logout navigations)
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location]);

  // Also react instantly if login/logout happens without a route change,
  // and keep in sync across tabs.
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-full transition-all duration-300 ${
      isActive
        ? "bg-purple-500 text-white shadow-lg"
        : "text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-gray-700"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("skills");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <header className="fixed-nav-bar">
      <nav
        className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md fixed top-0 left-0 w-full z-50
  backdrop-blur-md
  bg-white/70 dark:bg-gray-900/70
  shadow-md fixed top-0 left-0 w-full z-50"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          SkillBridge
        </h1>

        <div className="flex items-center gap-4">
          <NavLink to="/" className={linkStyle}>
            Home
          </NavLink>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="
                px-4 py-2 rounded-full font-semibold text-white
                bg-purple-600 hover:bg-purple-700
                shadow-lg transition transform hover:scale-105
              "
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className={linkStyle}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkStyle}>
                Register
              </NavLink>
            </>
          )}

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
