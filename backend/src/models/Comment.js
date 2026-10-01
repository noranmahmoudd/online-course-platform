import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    content: { type: String, required: [true, "Comment content is required"], trim: true },
  },
  { timestamps: true }
);

commentSchema.index({ lesson: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
