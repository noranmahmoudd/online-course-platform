import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseForm from "../../components/CourseForm";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getCourse, updateCourse } from "../../services/courseService";
import { getErrorMessage } from "../../utils/helpers";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setCourse(await getCourse(id));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values) => {
    await updateCourse(id, values);
    navigate("/instructor/courses");
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Edit course</h1>
      <CourseForm
        initialValues={{
          title: course.title,
          description: course.description,
          category: course.category,
          image: course.image,
          price: course.price,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditCourse;
