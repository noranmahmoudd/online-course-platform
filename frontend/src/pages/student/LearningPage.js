import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ProgressBar from "../../components/ProgressBar";
import { getCourse } from "../../services/courseService";
import { getCourseLessons } from "../../services/lessonService";
import { getEnrollment } from "../../services/enrollmentService";
import { getErrorMessage } from "../../utils/helpers";

const LearningPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, lessonData, status] = await Promise.all([
          getCourse(courseId),
          getCourseLessons(courseId),
          getEnrollment(courseId),
        ]);
        setCourse(courseData);
        setLessons(lessonData);
        setEnrollment(status.enrollment);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  // Not enrolled: send the student to the public course page to enroll
  if (!enrollment) return <Navigate to={`/courses/${courseId}`} replace />;

  return (
    <div>
      <Link to="/student/my-courses" className="small">← Back to My Courses</Link>
      <h1>{course.title}</h1>
      <p className="muted">Instructor: {course.instructor?.name}</p>

      <div className="card card-body">
        <strong>Your progress</strong>
        <ProgressBar value={enrollment.progress} />
        <p className="small muted">You can update your progress inside any lesson.</p>
      </div>

      <h2 className="section-title">Lessons</h2>
      {lessons.length === 0 ? (
        <div className="empty-state"><p className="muted">The instructor has not added lessons yet.</p></div>
      ) : (
        <ol className="list">
          {lessons.map((lesson) => (
            <li key={lesson._id} className="list-item">
              <div>
                <strong>{lesson.order}. {lesson.title}</strong>
                {lesson.description && <p className="small muted">{lesson.description}</p>}
              </div>
              <Link to={`/student/courses/${courseId}/lessons/${lesson._id}`} className="btn btn-primary btn-sm">
                Open
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default LearningPage;
