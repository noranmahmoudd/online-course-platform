import { Link, useNavigate, useParams } from "react-router-dom";
import LessonForm from "../../components/LessonForm";
import { createLesson } from "../../services/lessonService";

const CreateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createLesson(id, values);
    navigate(`/instructor/courses/${id}/lessons`);
  };

  return (
    <div>
      <Link to={`/instructor/courses/${id}/lessons`} className="small">← Back to lessons</Link>
      <h1>Add a lesson</h1>
      <LessonForm onSubmit={handleSubmit} submitLabel="Create Lesson" />
    </div>
  );
};

export default CreateLesson;
