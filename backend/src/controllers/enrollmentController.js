import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendResponse.js";
import { findCourseOrFail, findEnrollment } from "../utils/courseAccess.js";

export const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await findCourseOrFail(req.params.courseId);

  const existing = await findEnrollment(req.user._id, course._id);
  if (existing) throw new AppError("You are already enrolled in this course", 409);

  const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
  sendSuccess(res, 201, "Enrolled successfully", { enrollment });
});

export const getMyCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: "course", populate: { path: "instructor", select: "name" } })
    .sort({ enrolledAt: -1 });

  // Skip enrollments whose course no longer exists
  const valid = enrollments.filter((enrollment) => enrollment.course);
  sendSuccess(res, 200, "Enrolled courses fetched successfully", { enrollments: valid });
});

export const getEnrollment = asyncHandler(async (req, res) => {
  await findCourseOrFail(req.params.courseId);
  const enrollment = await findEnrollment(req.user._id, req.params.courseId);

  sendSuccess(res, 200, "Enrollment status fetched successfully", {
    enrolled: Boolean(enrollment),
    enrollment,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await findEnrollment(req.user._id, req.params.courseId);
  if (!enrollment) throw new AppError("You are not enrolled in this course", 404);

  enrollment.progress = Number(req.body.progress);
  await enrollment.save();

  sendSuccess(res, 200, "Progress updated successfully", { enrollment });
});
