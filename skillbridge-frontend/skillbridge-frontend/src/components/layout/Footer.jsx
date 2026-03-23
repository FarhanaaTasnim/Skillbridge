const Footer = () => {
  return (
    <footer className="
      w-full
      backdrop-blur-md
      bg-white/70 dark:bg-gray-900/70
      shadow-inner
      transition-all duration-500
    ">
      <div className="max-w-7xl mx-auto px-8 py-6 text-center">

        <p className="text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Smart Skill-Based Job Matching Platform
        </p>

      </div>
    </footer>
  );
};

export default Footer;