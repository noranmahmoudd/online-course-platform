import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ProgressBar from "../../components/ProgressBar";
import { deleteCourse, getCourse } from "../../services/courseService";
import { getCourseLessons } from "../../services/lessonService";
import { enroll, getEnrollment } from "../../services/enrollmentService";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";
import { formatPrice, getErrorMessage } from "../../utils/helpers";

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const isStudent = isAuthenticated && user.role === "student";
  const isOwner = isAuthenticated && user.role === "instructor" && course?.instructor?._id === user.id;

  const loadData = useCallback(async () => {
    try {
      const [courseData, lessonData] = await Promise.all([getCourse(id), getCourseLessons(id)]);
      setCourse(courseData);
      setLessons(lessonData);
      if (isStudent) {
        const status = await getEnrollment(id);
        setEnrollment(status.enrollment);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, isStudent]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    setActionError("");
    setEnrolling(true);
    try {
      setEnrollment(await enroll(id));
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setEnrolling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this course and all its lessons?")) return;
    try {
      await deleteCourse(id);
      navigate("/instructor/courses");
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="container page"><ErrorMessage message={error} /></div>;

  return (
    <div className="container page">
      <div className="details-header">
        <img
          src={course.image || PLACEHOLDER_IMAGE}
          alt={course.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div>
          <span className="badge">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="muted">Instructor: {course.instructor?.name}</p>
          <p className="price-lg">{formatPrice(course.price)}</p>

          <ErrorMessage message={actionError} />

          {(!isAuthenticated || isStudent) && !enrollment && (
            <button className="btn btn-primary" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
          )}

          {isStudent && enrollment && (
            <>
              <ProgressBar value={enrollment.progress} />
              <Link to={`/student/courses/${id}/learn`} className="btn btn-accent">
                Continue Learning
              </Link>
            </>
          )}

          {isOwner && (
            <div className="btn-row">
              <Link to={`/instructor/courses/${id}/edit`} className="btn btn-outline">Edit Course</Link>
              <Link to={`/instructor/courses/${id}/lessons`} className="btn btn-primary">Manage Lessons</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <h2>About this course</h2>
        <p className="pre-wrap">{course.description}</p>
      </section>

      <section className="section">
        <h2>Lessons ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <p className="muted">No lessons have been added yet.</p>
        ) : (
          <ol className="list">
            {lessons.map((lesson) => (
              <li key={lesson._id} className="list-item">
                <div>
                  <strong>{lesson.order}. {lesson.title}</strong>
                  {lesson.description && <p className="muted small">{lesson.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
        {!enrollment && !isOwner && lessons.length > 0 && (
          <p className="small muted">Enroll in this course to access the lesson content.</p>
        )}
      </section>
    </div>
  );
};

export default CourseDetails;
