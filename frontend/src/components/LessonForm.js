import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const emptyLesson = { title: "", description: "", content: "", videoUrl: "", order: "" };

const LessonForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [form, setForm] = useState({ ...emptyLesson, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const payload = { ...form };
    if (payload.order === "") delete payload.order;
    else payload.order = Number(payload.order);
    try {
      await onSubmit(payload);
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
        <textarea name="description" rows="2" value={form.description} onChange={handleChange} />
      </label>

      <label>
        Content
        <textarea name="content" rows="8" value={form.content} onChange={handleChange} />
      </label>

      <label>
        Video URL (optional)
        <input name="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." value={form.videoUrl} onChange={handleChange} />
      </label>

      <label>
        Order (leave empty to add at the end)
        <input name="order" type="number" min="1" value={form.order} onChange={handleChange} />
      </label>

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default LessonForm;
