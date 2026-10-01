import { Router } from "express";
import { getLesson, updateLesson, deleteLesson } from "../controllers/lessonController.js";
import { getComments, createComment } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateLessonValidator, lessonIdValidator } from "../validators/lessonValidator.js";
import {
  createCommentValidator,
  lessonIdParamValidator,
} from "../validators/commentValidator.js";

const router = Router();

router.get("/:id", requireAuth, lessonIdValidator, validate, getLesson);
router.put("/:id", requireAuth, requireRole("instructor"), updateLessonValidator, validate, updateLesson);
router.delete("/:id", requireAuth, requireRole("instructor"), lessonIdValidator, validate, deleteLesson);

// Comments of a lesson (students only)
router.get("/:lessonId/comments", requireAuth, requireRole("student"), lessonIdParamValidator, validate, getComments);
router.post("/:lessonId/comments", requireAuth, requireRole("student"), createCommentValidator, validate, createComment);

export default router;
