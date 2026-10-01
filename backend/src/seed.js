import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Lesson from "./models/Lesson.js";
import Enrollment from "./models/Enrollment.js";
import Comment from "./models/Comment.js";
import staticCourses from "./data/courses.js";

// npm run seed          -> wipes the database, then adds demo users + static courses
// npm run seed:courses  -> keeps existing data, only adds static courses that are missing
const coursesOnly = process.argv.includes("--courses-only");

const getOrCreateUser = async (name, email, role) => {
  const existing = await User.findOne({ email });
  return existing || User.create({ name, email, password: "Password123", role });
};

const seed = async () => {
  await connectDB();

  if (!coursesOnly) {
    await Promise.all([
      Comment.deleteMany(),
      Enrollment.deleteMany(),
      Lesson.deleteMany(),
      Course.deleteMany(),
      User.deleteMany(),
    ]);
    console.log("Database cleared.");
  }

  const instructor = await getOrCreateUser("Demo Instructor", "instructor@example.com", "instructor");
  await getOrCreateUser("Demo Student", "student@example.com", "student");

  let added = 0;
  for (const { lessons, ...courseData } of staticCourses) {
    const exists = await Course.findOne({ title: courseData.title });
    if (exists) continue;

    const course = await Course.create({ ...courseData, instructor: instructor._id });
    await Lesson.insertMany(lessons.map((lesson, index) => ({ ...lesson, course: course._id, order: index + 1 })));
    added++;
  }

  console.log(`Static courses added: ${added} (skipped ${staticCourses.length - added} that already exist)`);
  console.log("Instructor: instructor@example.com / Password123");
  console.log("Student:    student@example.com / Password123");
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
