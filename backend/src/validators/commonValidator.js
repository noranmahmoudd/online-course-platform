import { param } from "express-validator";

export const objectIdParam = (name) =>
  param(name).isMongoId().withMessage(`Invalid ${name}`);
