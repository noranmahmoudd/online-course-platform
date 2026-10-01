import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    videoUrl: { type: String, trim: true, default: "" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, min: 1, default: 1 },
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1, order: 1 });

export default mongoose.model("Lesson", lessonSchema);
