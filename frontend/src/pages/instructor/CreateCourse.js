import { useNavigate } from "react-router-dom";
import CourseForm from "../../components/CourseForm";
import { createCourse } from "../../services/courseService";

const CreateCourse = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const course = await createCourse(values);
    navigate(`/instructor/courses/${course._id}/lessons`);
  };

  return (
    <div>
      <h1>Create a new course</h1>
      <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" />
    </div>
  );
};

export default CreateCourse;
