import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { getCourses } from "../../services/courseService";
import { CATEGORIES } from "../../utils/constants";
import { getErrorMessage } from "../../utils/helpers";

const PAGE_SIZE = 6;

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCourses({ page, limit: PAGE_SIZE, search, category });
        setCourses(data.courses);
        setPagination(data.pagination);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [search, category, page]);

  const updateParams = (changes) => {
    const next = { ...(search && { search }), ...(category && { category }), page: 1, ...changes };
    Object.keys(next).forEach((key) => {
      if (!next[key] || (key === "page" && next[key] === 1)) delete next[key];
    });
    setSearchParams(next);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  return (
    <div className="container page">
      <h1>All courses</h1>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <select value={category} onChange={(event) => updateParams({ category: event.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button className="btn btn-primary">Search</button>
      </form>

      {loading && <Loading message="Loading courses..." />}
      <ErrorMessage message={error} />

      {!loading && !error && courses.length === 0 && (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p className="muted">Try a different search term or category.</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <>
          <p className="muted">{pagination.total} course(s) found</p>
          <div className="grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="pagination">
            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })}>
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button
              className="btn btn-outline btn-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => updateParams({ page: page + 1 })}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
