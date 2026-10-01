import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getCourse, getCourseStats } from "../../services/courseService";
import { deleteLesson, getCourseLessons } from "../../services/lessonService";
import { getErrorMessage } from "../../utils/helpers";

const CourseLessons = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, lessonData, statsData] = await Promise.all([
          getCourse(id),
          getCourseLessons(id),
          getCourseStats(id), // also confirms ownership (403 for other instructors)
        ]);
        setCourse(courseData);
        setLessons(lessonData);
        setStats(statsData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    setError("");
    try {
      await deleteLesson(lesson._id);
      setLessons(lessons.filter((item) => item._id !== lesson._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  if (!course) return <ErrorMessage message={error} />;

  return (
    <div>
      <Link to="/instructor/courses" className="small">← Back to My Courses</Link>
      <div className="row-between">
        <h1>{course.title}</h1>
        <Link to={`/instructor/courses/${id}/lessons/new`} className="btn btn-accent">+ Add Lesson</Link>
      </div>
      <ErrorMessage message={error} />

      {stats && (
        <div className="stats">
          <div className="stat-card"><span>{lessons.length}</span><p>Lessons</p></div>
          <div className="stat-card"><span>{stats.totalStudents}</span><p>Students</p></div>
          <div className="stat-card"><span>{stats.completedStudents}</span><p>Completed</p></div>
          <div className="stat-card"><span>{stats.averageProgress}%</span><p>Avg. progress</p></div>
        </div>
      )}

      <h2 className="section-title">Lessons</h2>
      {lessons.length === 0 ? (
        <div className="empty-state"><p className="muted">No lessons yet. Add your first lesson.</p></div>
      ) : (
        <ul className="list">
          {lessons.map((lesson) => (
            <li key={lesson._id} className="list-item">
              <div>
                <strong>{lesson.order}. {lesson.title}</strong>
                {lesson.description && <p className="small muted">{lesson.description}</p>}
              </div>
              <div className="btn-row">
                <Link to={`/instructor/lessons/${lesson._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lesson)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseLessons;
