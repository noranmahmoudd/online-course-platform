import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ProgressBar from "../../components/ProgressBar";
import { getMyCourses } from "../../services/enrollmentService";
import { getErrorMessage } from "../../utils/helpers";

const MyCourses = () => {
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

  return (
    <div>
      <h1>My Courses</h1>
      <ErrorMessage message={error} />

      {enrollments.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No enrolled courses</h3>
          <p className="muted">Enroll in a course to start learning.</p>
          <Link to="/courses" className="btn btn-accent">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {enrollments.map((item) => (
            <div key={item._id} className="card card-body">
              <span className="badge">{item.course.category}</span>
              <h3>{item.course.title}</h3>
              <p className="small muted">By {item.course.instructor?.name}</p>
              <ProgressBar value={item.progress} />
              <Link to={`/student/courses/${item.course._id}/learn`} className="btn btn-primary">
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
