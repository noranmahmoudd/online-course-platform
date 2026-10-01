import AppError from "../utils/AppError.js";

// Usage: requireRole("instructor") or requireRole("student", "instructor")
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized to perform this action", 403));
    }
    next();
  };
