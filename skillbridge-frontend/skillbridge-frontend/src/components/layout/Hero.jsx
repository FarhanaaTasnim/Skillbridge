import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-12 sm:py-24 px-4 sm:px-6">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight
          bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500
          bg-clip-text text-transparent
        "
      >
        Find Jobs That Truly Match Your Skills
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="
          mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl
          text-gray-700 dark:text-gray-300
        "
      >
        Our AI scans live remote listings from Jobicy and Arbeitnow 
        ranks every job by how well it matches your skills —  
        so you apply smarter, not harder.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
      >
        <Link
          to="/register"
          className="
            px-8 py-3 rounded-full font-semibold text-white
            bg-purple-600 hover:bg-purple-700
            shadow-lg transition transform hover:scale-105
            text-center
          "
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="
            px-8 py-3 rounded-full font-semibold
            bg-white dark:bg-gray-800
            text-purple-600 dark:text-purple-400
            border border-purple-400
            hover:bg-purple-100 dark:hover:bg-gray-700
            transition
            text-center
          "
        >
          Try Demo
        </Link>
      </motion.div>

      {/* Feature Tags */}
      <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm px-2">
        <span className="bg-purple-100 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full">
          🎯 Skill-Based Matching
        </span>
        <span className="bg-pink-100 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full">
          📊 Percentage Ranking
        </span>
        <span className="bg-blue-100 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full">
          🌍 Multiple Job Platforms
        </span>
      </div>
    </section>
  );
};

export default Hero;