import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ErrorMessage from "../../components/ErrorMessage";
import { getErrorMessage } from "../../utils/helpers";

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dashboardFor = (role) => (role === "instructor" ? "/instructor/dashboard" : "/student/dashboard");

  if (isAuthenticated) return <Navigate to={dashboardFor(user.role)} replace />;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      navigate(location.state?.from?.pathname || dashboardFor(loggedInUser.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="form card card-body auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue learning or managing your courses.</p>
        <ErrorMessage message={error} />
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
        <p className="small center">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
