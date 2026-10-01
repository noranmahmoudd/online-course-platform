import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getInstructorCourses } from "../../services/courseService";
import { getErrorMessage } from "../../utils/helpers";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setCourses(await getInstructorCourses());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessonsCount, 0);
  const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);

  return (
    <div>
      <div className="row-between">
        <h1>Hello, {user.name}</h1>
        <Link to="/instructor/courses/new" className="btn btn-accent">+ Create Course</Link>
      </div>
      <ErrorMessage message={error} />

      <div className="stats">
        <div className="stat-card"><span>{courses.length}</span><p>Total courses</p></div>
        <div className="stat-card"><span>{totalLessons}</span><p>Total lessons</p></div>
        <div className="stat-card"><span>{totalStudents}</span><p>Total enrollments</p></div>
      </div>

      <h2 className="section-title">Your courses</h2>
      {courses.length === 0 ? (
        <div className="empty-state">
          <p className="muted">You have not created any course yet.</p>
        </div>
      ) : (
        <ul className="list">
          {courses.map((course) => (
            <li key={course._id} className="list-item">
              <div>
                <strong>{course.title}</strong>
                <p className="small muted">
                  {course.category} · {course.lessonsCount} lessons · {course.studentsCount} students
                </p>
              </div>
              <Link to={`/instructor/courses/${course._id}/lessons`} className="btn btn-primary btn-sm">
                Manage
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstructorDashboard;
