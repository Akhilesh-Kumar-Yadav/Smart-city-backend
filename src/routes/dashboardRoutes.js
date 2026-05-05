import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"), 
  getDashboardStats
);

export default router;