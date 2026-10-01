import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { sendSuccess } from "../utils/sendResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email is already registered", 409);

  const user = await User.create({ name, email, password, role: role || "student" });
  const token = generateToken(user._id);

  sendSuccess(res, 201, "Registration successful", { token, user: user.toPublic() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so ask for it explicitly
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);
  sendSuccess(res, 200, "Login successful", { token, user: user.toPublic() });
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Current user fetched successfully", { user: req.user.toPublic() });
});
