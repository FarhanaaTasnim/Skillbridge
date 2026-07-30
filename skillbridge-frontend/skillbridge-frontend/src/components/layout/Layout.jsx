import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="
        min-h-screen flex flex-col transition-all duration-500

        bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black

        text-gray-900 dark:text-gray-100
      "
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow px-4 py-6 pt-24 sm:px-6 sm:pt-28 sm:py-8 lg:p-10 lg:pt-28 animate-fadeIn">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;