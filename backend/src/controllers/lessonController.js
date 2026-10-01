import Lesson from "../models/Lesson.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendResponse.js";
import {
  findCourseOrFail,
  findOwnedCourseOrFail,
  assertCanAccessCourseContent,
} from "../utils/courseAccess.js";

// Public outline: no content / video, so protected material stays protected
export const getCourseLessons = asyncHandler(async (req, res) => {
  const course = await findCourseOrFail(req.params.courseId);
  const lessons = await Lesson.find({ course: course._id })
    .select("title description order course createdAt")
    .sort({ order: 1, createdAt: 1 });

  sendSuccess(res, 200, "Lessons fetched successfully", { lessons });
});

// Protected: owner instructor or enrolled student
export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new AppError("Lesson not found", 404);

  const course = await findCourseOrFail(lesson.course);
  await assertCanAccessCourseContent(req.user, course);

  sendSuccess(res, 200, "Lesson fetched successfully", { lesson });
});

export const createLesson = asyncHandler(async (req, res) => {
  const course = await findOwnedCourseOrFail(
    req.params.courseId,
    req.user,
    "add lessons to this course"
  );
  const { title, description, content, videoUrl, order } = req.body;

  const nextOrder = order || (await Lesson.countDocuments({ course: course._id })) + 1;
  const lesson = await Lesson.create({
    title,
    description,
    content,
    videoUrl,
    order: nextOrder,
    course: course._id,
  });

  sendSuccess(res, 201, "Lesson created successfully", { lesson });
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new AppError("Lesson not found", 404);
  await findOwnedCourseOrFail(lesson.course, req.user, "modify this lesson");

  const { title, description, content, videoUrl, order } = req.body;
  lesson.title = title;
  if (description !== undefined) lesson.description = description;
  if (content !== undefined) lesson.content = content;
  if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
  if (order !== undefined) lesson.order = order;
  await lesson.save();

  sendSuccess(res, 200, "Lesson updated successfully", { lesson });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new AppError("Lesson not found", 404);
  await findOwnedCourseOrFail(lesson.course, req.user, "delete this lesson");

  await Comment.deleteMany({ lesson: lesson._id });
  await lesson.deleteOne();

  sendSuccess(res, 200, "Lesson deleted successfully");
});
