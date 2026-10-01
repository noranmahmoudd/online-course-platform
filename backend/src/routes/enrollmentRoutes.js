import { Router } from "express";
import { getMyCourses } from "../controllers/enrollmentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/my-courses", requireAuth, requireRole("student"), getMyCourses);

export default router;
