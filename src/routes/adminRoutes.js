import express from "express";
import {
  createWorker,
  deleteWorker,
  
} from "../controllers/adminController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/create-worker",protect, isAdmin, createWorker);
router.delete("/worker/:id", protect, isAdmin, deleteWorker);

export default router;