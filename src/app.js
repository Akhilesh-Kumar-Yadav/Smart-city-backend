import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Middleware
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);


app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

// Test Route

app.get("/", (req, res) => {
  res.send("SmartCity API is running 🚀");
});

app.get("/api/test-protected", protect, (req, res) => {
  res.json({ message: "Protected route works", user: req.user });
});

export default app;