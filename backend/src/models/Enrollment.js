import mongoose from "mongoose";

export const PROGRESS_VALUES = [0, 25, 50, 75, 100];

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: {
    type: Number,
    default: 0,
    enum: { values: PROGRESS_VALUES, message: "Progress must be 0, 25, 50, 75 or 100" },
  },
});

// A student can enroll in a course only once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
