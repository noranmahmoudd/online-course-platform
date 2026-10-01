import { body } from "express-validator";
import { PROGRESS_VALUES } from "../models/Enrollment.js";
import { objectIdParam } from "./commonValidator.js";

export const progressValidator = [
  objectIdParam("courseId"),
  body("progress")
    .isInt().withMessage("Progress must be a number")
    .bail()
    .custom((value) => PROGRESS_VALUES.includes(Number(value)))
    .withMessage("Progress must be one of 0, 25, 50, 75, 100"),
];
