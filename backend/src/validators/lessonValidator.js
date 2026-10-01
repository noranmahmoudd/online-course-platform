import { body } from "express-validator";
import { objectIdParam } from "./commonValidator.js";

const lessonFields = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString().withMessage("Description must be text"),
  body("content").optional().isString().withMessage("Content must be text"),
  body("videoUrl")
    .optional({ values: "falsy" })
    .isURL().withMessage("Video URL must be a valid URL"),
  body("order").optional().isInt({ min: 1 }).withMessage("Order must be a positive integer"),
  body().custom((value) => {
    if (!value.description?.trim() && !value.content?.trim()) {
      throw new Error("Lesson needs a description or content");
    }
    return true;
  }),
];

export const createLessonValidator = [objectIdParam("courseId"), ...lessonFields];
export const updateLessonValidator = [objectIdParam("id"), ...lessonFields];
export const lessonIdValidator = [objectIdParam("id")];
