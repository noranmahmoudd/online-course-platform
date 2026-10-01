import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "../utils/constants";
import { formatPrice } from "../utils/helpers";

const CourseCard = ({ course }) => (
  <article className="card course-card">
    <img
      src={course.image || PLACEHOLDER_IMAGE}
      alt={course.title}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = PLACEHOLDER_IMAGE;
      }}
    />
    <div className="card-body">
      <span className="badge">{course.category}</span>
      <h3>{course.title}</h3>
      <p className="muted line-clamp">{course.description}</p>
      <p className="small">By {course.instructor?.name || "Unknown instructor"}</p>
      <div className="card-footer">
        <strong className="price">{formatPrice(course.price)}</strong>
        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  </article>
);

export default CourseCard;
