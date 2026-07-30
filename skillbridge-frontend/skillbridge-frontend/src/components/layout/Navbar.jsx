import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // Re-check auth whenever the route changes (covers login/logout navigations)
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location]);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
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
    `px-4 py-2 rounded-full transition-all duration-300 block sm:inline-block text-center ${
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
        className="
          backdrop-blur-md
          bg-white/70 dark:bg-gray-900/70
          shadow-md fixed top-0 left-0 w-full z-50
        "
      >
        <div className="flex justify-between items-center px-4 sm:px-8 py-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            SkillBridge
          </h1>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
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

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile controls: dark mode toggle + hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <NavLink to="/" className={linkStyle}>
              Home
            </NavLink>

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="
                  w-full px-4 py-2 rounded-full font-semibold text-white
                  bg-purple-600 hover:bg-purple-700
                  shadow-lg transition
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
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;