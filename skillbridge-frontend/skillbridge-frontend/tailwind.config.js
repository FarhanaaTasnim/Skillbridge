export default {
    darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",     // soft purple
        secondary: "#EC4899",   // pink
        accent: "#FDE68A",      // soft yellow
        softBg: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};