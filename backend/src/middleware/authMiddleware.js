import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in", 401);
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token has expired. Please log in again", 401);
    }
    throw new AppError("Invalid token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("The user belonging to this token no longer exists", 401);
  }

  req.user = user;
  next();
});
