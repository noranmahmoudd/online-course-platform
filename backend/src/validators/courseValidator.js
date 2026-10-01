import { body } from "express-validator";
import { CATEGORIES } from "../models/Course.js";
import { objectIdParam } from "./commonValidator.js";

const courseFields = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(", ")}`),
  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),
  body("image").optional().isString().withMessage("Image must be a URL string").trim(),
];

export const createCourseValidator = courseFields;
export const updateCourseValidator = [objectIdParam("id"), ...courseFields];
export const courseIdValidator = [objectIdParam("id")];
export const courseIdParamValidator = [objectIdParam("courseId")];
