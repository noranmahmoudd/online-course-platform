import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ProgressBar from "../../components/ProgressBar";
import { getMyCourses } from "../../services/enrollmentService";
import { getErrorMessage } from "../../utils/helpers";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setEnrollments(await getMyCourses());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  const completed = enrollments.filter((item) => item.progress === 100).length;
  const average = enrollments.length
    ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length)
    : 0;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <ErrorMessage message={error} />

      <div className="stats">
        <div className="stat-card"><span>{enrollments.length}</span><p>Enrolled courses</p></div>
        <div className="stat-card"><span>{completed}</span><p>Completed</p></div>
        <div className="stat-card"><span>{average}%</span><p>Average progress</p></div>
      </div>

      <div className="btn-row">
        <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        <Link to="/student/my-courses" className="btn btn-outline">My Courses</Link>
        <Link to="/student/profile" className="btn btn-outline">Profile</Link>
      </div>

      <h2 className="section-title">Recent courses</h2>
      {enrollments.length === 0 ? (
        <div className="empty-state">
          <p className="muted">You have not enrolled in any course yet.</p>
          <Link to="/courses" className="btn btn-accent">Find a course</Link>
        </div>
      ) : (
        <ul className="list">
          {enrollments.slice(0, 3).map((item) => (
            <li key={item._id} className="list-item column">
              <div className="row-between">
                <strong>{item.course.title}</strong>
                <Link to={`/student/courses/${item.course._id}/learn`} className="btn btn-primary btn-sm">
                  Continue Learning
                </Link>
              </div>
              <ProgressBar value={item.progress} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
