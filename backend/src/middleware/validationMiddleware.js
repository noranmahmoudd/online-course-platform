import { validationResult } from "express-validator";

// Runs after the validator chains and returns a 400 with all messages
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const messages = errors.array().map((err) => err.msg);
  return res.status(400).json({
    success: false,
    message: messages[0],
    errors: messages,
  });
};
