import Comment from "../models/Comment.js";
import Lesson from "../models/Lesson.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendResponse.js";
import { findCourseOrFail, assertCanAccessCourseContent } from "../utils/courseAccess.js";

// Loads the lesson and makes sure the student is enrolled in its course
const getLessonForStudent = async (lessonId, user) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new AppError("Lesson not found", 404);
  const course = await findCourseOrFail(lesson.course);
  await assertCanAccessCourseContent(user, course);
  return lesson;
};

export const getComments = asyncHandler(async (req, res) => {
  const lesson = await getLessonForStudent(req.params.lessonId, req.user);
  const comments = await Comment.find({ lesson: lesson._id })
    .populate("student", "name")
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, "Comments fetched successfully", { comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const lesson = await getLessonForStudent(req.params.lessonId, req.user);
  const comment = await Comment.create({
    student: req.user._id,
    lesson: lesson._id,
    content: req.body.content,
  });
  await comment.populate("student", "name");

  sendSuccess(res, 201, "Comment added successfully", { comment });
});

const findOwnCommentOrFail = async (commentId, user, action) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError("Comment not found", 404);
  if (comment.student.toString() !== user._id.toString()) {
    throw new AppError(`You are not allowed to ${action} this comment`, 403);
  }
  return comment;
};

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await findOwnCommentOrFail(req.params.id, req.user, "edit");
  comment.content = req.body.content;
  await comment.save();
  await comment.populate("student", "name");

  sendSuccess(res, 200, "Comment updated successfully", { comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await findOwnCommentOrFail(req.params.id, req.user, "delete");
  await comment.deleteOne();

  sendSuccess(res, 200, "Comment deleted successfully");
});
