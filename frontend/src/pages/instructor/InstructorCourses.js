import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { deleteCourse, getInstructorCourses } from "../../services/courseService";
import { formatPrice, getErrorMessage } from "../../utils/helpers";

const InstructorCourses = () => {
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

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}" and all its lessons?`)) return;
    setError("");
    try {
      await deleteCourse(course._id);
      setCourses(courses.filter((item) => item._id !== course._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="row-between">
        <h1>My Courses</h1>
        <Link to="/instructor/courses/new" className="btn btn-accent">+ Create Course</Link>
      </div>
      <ErrorMessage message={error} />

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses yet</h3>
          <p className="muted">Create your first course to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Lessons</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td><Link to={`/courses/${course._id}`}>{course.title}</Link></td>
                  <td>{course.category}</td>
                  <td>{formatPrice(course.price)}</td>
                  <td>{course.lessonsCount}</td>
                  <td>{course.studentsCount}</td>
                  <td>
                    <div className="btn-row">
                      <Link to={`/instructor/courses/${course._id}/lessons`} className="btn btn-primary btn-sm">Lessons</Link>
                      <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
