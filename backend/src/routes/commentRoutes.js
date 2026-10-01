import { Router } from "express";
import { updateComment, deleteComment } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateCommentValidator, commentIdValidator } from "../validators/commentValidator.js";

const router = Router();

router.put("/:id", requireAuth, requireRole("student"), updateCommentValidator, validate, updateComment);
router.delete("/:id", requireAuth, requireRole("student"), commentIdValidator, validate, deleteComment);

export default router;
