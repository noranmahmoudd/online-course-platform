import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { CATEGORIES } from "../utils/constants";

const emptyCourse = { title: "", description: "", category: CATEGORIES[0], image: "", price: 0 };

const CourseForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [form, setForm] = useState({ ...emptyCourse, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="form card card-body" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Description
        <textarea name="description" rows="4" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Image URL
        <input name="image" type="url" placeholder="https://..." value={form.image} onChange={handleChange} />
      </label>

      <label>
        Price (USD, 0 for free)
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
      </label>

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default CourseForm;
