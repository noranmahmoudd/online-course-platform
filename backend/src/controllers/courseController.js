import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendResponse.js";
import { findOwnedCourseOrFail } from "../utils/courseAccess.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getCourses = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const { search, category } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Course.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Courses fetched successfully", {
    courses,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor", "name email");
  if (!course) throw new AppError("Course not found", 404);
  sendSuccess(res, 200, "Course fetched successfully", { course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, image, price } = req.body;

  // instructor always comes from the token, never from the request body
  const course = await Course.create({
    title,
    description,
    category,
    image,
    price,
    instructor: req.user._id,
  });

  sendSuccess(res, 201, "Course created successfully", { course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await findOwnedCourseOrFail(req.params.id, req.user, "modify this course");
  const { title, description, category, image, price } = req.body;

  course.title = title;
  course.description = description;
  course.category = category;
  if (image !== undefined) course.image = image;
  if (price !== undefined) course.price = price;
  await course.save();

  sendSuccess(res, 200, "Course updated successfully", { course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await findOwnedCourseOrFail(req.params.id, req.user, "delete this course");

  // Remove related data: comments -> lessons -> enrollments -> course
  const lessons = await Lesson.find({ course: course._id }).select("_id");
  const lessonIds = lessons.map((lesson) => lesson._id);
  await Comment.deleteMany({ lesson: { $in: lessonIds } });
  await Lesson.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  sendSuccess(res, 200, "Course deleted successfully");
});

// Instructor: own courses with lesson / student counts
export const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

  const withCounts = await Promise.all(
    courses.map(async (course) => {
      const [lessonsCount, studentsCount] = await Promise.all([
        Lesson.countDocuments({ course: course._id }),
        Enrollment.countDocuments({ course: course._id }),
      ]);
      return { ...course.toObject(), lessonsCount, studentsCount };
    })
  );

  sendSuccess(res, 200, "Instructor courses fetched successfully", { courses: withCounts });
});

// Instructor: statistics for one owned course
export const getCourseStats = asyncHandler(async (req, res) => {
  const course = await findOwnedCourseOrFail(req.params.id, req.user, "view statistics of this course");

  const [totalLessons, enrollments] = await Promise.all([
    Lesson.countDocuments({ course: course._id }),
    Enrollment.find({ course: course._id }),
  ]);

  const totalStudents = enrollments.length;
  const completedStudents = enrollments.filter((e) => e.progress === 100).length;
  const averageProgress = totalStudents
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalStudents)
    : 0;

  sendSuccess(res, 200, "Course statistics fetched successfully", {
    stats: { totalLessons, totalStudents, completedStudents, averageProgress },
  });
});
