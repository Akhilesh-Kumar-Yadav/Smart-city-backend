import express from "express";
import {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// Create complaint (user)
router.post(
  "/",
  protect,
  upload.single("image"),
  createComplaint
);


// Get complaints (all logged users)
router.get("/", protect, getComplaints);


// Assign complaint (ADMIN ONLY)
router.put(
  "/assign",
  protect,
  isAdmin,
  assignComplaint
);


// Update status (WORKER ONLY logic handled inside controller)
router.put(
  "/status",
  protect,
  upload.single("proofImage"),
  updateComplaintStatus
);

export default router;