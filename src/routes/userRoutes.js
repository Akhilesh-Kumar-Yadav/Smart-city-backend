import express from "express";
import { getWorkers } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Only admin can access workers list
router.get(
  "/workers",
  protect,
  authorize("admin"),
  getWorkers
);

export default router;