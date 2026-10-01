import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "./AppError.js";

// Returns the course or throws 404
export const findCourseOrFail = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);
  return course;
};

// Returns the course only if the logged-in user owns it (403 otherwise)
export const findOwnedCourseOrFail = async (courseId, user, action = "modify this course") => {
  const course = await findCourseOrFail(courseId);
  if (course.instructor.toString() !== user._id.toString()) {
    throw new AppError(`You are not allowed to ${action}`, 403);
  }
  return course;
};

export const findEnrollment = (studentId, courseId) =>
  Enrollment.findOne({ student: studentId, course: courseId });

// Used for protected lesson content: owner instructor OR enrolled student
export const assertCanAccessCourseContent = async (user, course) => {
  if (user.role === "instructor") {
    if (course.instructor.toString() !== user._id.toString()) {
      throw new AppError("You are not allowed to access this course's content", 403);
    }
    return;
  }
  const enrollment = await findEnrollment(user._id, course._id);
  if (!enrollment) {
    throw new AppError("You must be enrolled in this course to access its content", 403);
  }
};
