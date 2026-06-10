import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import waterRoutes from "./routes/waterRoutes.js";
import aiRoutes from "./routes/ai.js";
import reportsRoutes from "./routes/reports.js";
import adminRoutes from "./routes/admin.js";

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("AquaSense API Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AquaSense API",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AquaSense API running on port ${PORT}`);
});