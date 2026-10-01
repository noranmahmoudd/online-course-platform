import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ErrorMessage from "../../components/ErrorMessage";
import { getErrorMessage } from "../../utils/helpers";

const Register = () => {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard"} replace />;
  }

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const newUser = await register(form);
      navigate(newUser.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="form card card-body auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="muted">Join as a student to learn, or as an instructor to teach.</p>
        <ErrorMessage message={error} />
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password (min 6 characters)
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          I want to join as
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
        <p className="small center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
