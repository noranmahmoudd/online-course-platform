import { body } from "express-validator";
import { objectIdParam } from "./commonValidator.js";

const contentField = body("content")
  .isString().withMessage("Content is required")
  .bail()
  .trim()
  .notEmpty().withMessage("Comment content cannot be empty")
  .isLength({ max: 1000 }).withMessage("Comment cannot exceed 1000 characters");

export const createCommentValidator = [objectIdParam("lessonId"), contentField];
export const updateCommentValidator = [objectIdParam("id"), contentField];
export const commentIdValidator = [objectIdParam("id")];
export const lessonIdParamValidator = [objectIdParam("lessonId")];
