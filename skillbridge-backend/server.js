import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables");
  process.exit(1);
}

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "yes" : "NO - MISSING");

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:5173",
    "https://skillbridge-frontend-psi.vercel.app"
  ];

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});