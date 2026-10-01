import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LessonForm from "../../components/LessonForm";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getLesson, updateLesson } from "../../services/lessonService";
import { getErrorMessage } from "../../utils/helpers";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLesson(await getLesson(lessonId));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const handleSubmit = async (values) => {
    await updateLesson(lessonId, values);
    navigate(`/instructor/courses/${lesson.course}/lessons`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <Link to={`/instructor/courses/${lesson.course}/lessons`} className="small">← Back to lessons</Link>
      <h1>Edit lesson</h1>
      <LessonForm
        initialValues={{
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          order: lesson.order,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditLesson;
