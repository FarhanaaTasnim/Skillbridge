import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import keepAlive from "./utils/keepAlive.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge API Running");
});

// THIS IS THE CRITICAL PART
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
keepAlive();