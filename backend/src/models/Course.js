import mongoose from "mongoose";

export const CATEGORIES = [
  "Web Development",
  "Machine Learning",
  "Data Science",
  "Programming",
  "Database",
  "Cyber Security",
];

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: { values: CATEGORIES, message: "Invalid category" },
    },
    image: { type: String, trim: true, default: "" },
    price: { type: Number, min: [0, "Price cannot be negative"], default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ title: 1 });
courseSchema.index({ category: 1 });

export default mongoose.model("Course", courseSchema);
