import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getCourses } from "../../services/courseService";
import { CATEGORIES } from "../../utils/constants";
import { getErrorMessage } from "../../utils/helpers";

const benefits = [
  { title: "Learn at your own pace", text: "Access lessons any time and track your progress as you go." },
  { title: "Real instructors", text: "Courses are created and maintained by experienced instructors." },
  { title: "Join the discussion", text: "Ask questions and share ideas in the comments of every lesson." },
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await getCourses({ page: 1, limit: 3 });
        setCourses(data.courses);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const startLink = !isAuthenticated
    ? "/register"
    : user.role === "instructor"
    ? "/instructor/dashboard"
    : "/student/dashboard";

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Learn new skills. Teach what you know.</h1>
          <p>
            LearnHub is an online course platform where students explore, enroll and track their progress,
            and instructors build and manage their own courses.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-accent">Explore Courses</Link>
            <Link to={startLink} className="btn btn-light">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Featured courses</h2>
        {loading && <Loading />}
        <ErrorMessage message={error} />
        {!loading && !error && courses.length === 0 && (
          <p className="muted">No courses yet. Check back soon!</p>
        )}
        <div className="grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Browse by category</h2>
        <div className="chips">
          {CATEGORIES.map((category) => (
            <Link key={category} to={`/courses?category=${encodeURIComponent(category)}`} className="chip">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Why LearnHub?</h2>
        <div className="grid">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="card card-body">
              <h3>{benefit.title}</h3>
              <p className="muted">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
