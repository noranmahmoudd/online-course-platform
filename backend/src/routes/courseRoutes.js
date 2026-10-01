import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCourseStats,
} from "../controllers/courseController.js";
import { getCourseLessons, createLesson } from "../controllers/lessonController.js";
import {
  enrollInCourse,
  getEnrollment,
  updateProgress,
} from "../controllers/enrollmentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createCourseValidator,
  updateCourseValidator,
  courseIdValidator,
  courseIdParamValidator,
} from "../validators/courseValidator.js";
import { createLessonValidator } from "../validators/lessonValidator.js";
import { progressValidator } from "../validators/enrollmentValidator.js";

const router = Router();

// Courses
router.get("/", getCourses);
router.get("/instructor/mine", requireAuth, requireRole("instructor"), getInstructorCourses);
router.post("/", requireAuth, requireRole("instructor"), createCourseValidator, validate, createCourse);
router.get("/:id", courseIdValidator, validate, getCourse);
router.put("/:id", requireAuth, requireRole("instructor"), updateCourseValidator, validate, updateCourse);
router.delete("/:id", requireAuth, requireRole("instructor"), courseIdValidator, validate, deleteCourse);
router.get("/:id/stats", requireAuth, requireRole("instructor"), courseIdValidator, validate, getCourseStats);

// Lessons of a course
router.get("/:courseId/lessons", courseIdParamValidator, validate, getCourseLessons);
router.post(
  "/:courseId/lessons",
  requireAuth,
  requireRole("instructor"),
  createLessonValidator,
  validate,
  createLesson
);

// Enrollment (students only)
router.post("/:courseId/enroll", requireAuth, requireRole("student"), courseIdParamValidator, validate, enrollInCourse);
router.get("/:courseId/enrollment", requireAuth, requireRole("student"), courseIdParamValidator, validate, getEnrollment);
router.put("/:courseId/progress", requireAuth, requireRole("student"), progressValidator, validate, updateProgress);

export default router;
