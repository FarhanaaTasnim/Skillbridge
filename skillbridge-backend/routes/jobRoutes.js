import express from "express";
import protect from "../middleware/authMiddleware.js";
import { fetchRemoteJobs } from "../controllers/jobController.js";

const router = express.Router();

router.post("/remote", protect, fetchRemoteJobs);

export default router;