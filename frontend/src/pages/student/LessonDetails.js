import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ProgressBar from "../../components/ProgressBar";
import { getCourseLessons, getLesson } from "../../services/lessonService";
import { getEnrollment, updateProgress } from "../../services/enrollmentService";
import { addComment, deleteComment, getComments, updateComment } from "../../services/commentService";
import { PROGRESS_OPTIONS } from "../../utils/constants";
import { formatDate, getErrorMessage, getYouTubeEmbedUrl, isDirectVideo } from "../../utils/helpers";

const LessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [lessonData, lessonList, status, commentList] = await Promise.all([
          getLesson(lessonId),
          getCourseLessons(courseId),
          getEnrollment(courseId),
          getComments(lessonId),
        ]);
        setLesson(lessonData);
        setLessons(lessonList);
        setEnrollment(status.enrollment);
        setComments(commentList);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, lessonId]);

  const handleProgress = async (value) => {
    try {
      setEnrollment(await updateProgress(courseId, value));
    } catch (err) {
      setCommentError(getErrorMessage(err));
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    setCommentError("");
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }
    try {
      const created = await addComment(lessonId, newComment);
      setComments([created, ...comments]);
      setNewComment("");
    } catch (err) {
      setCommentError(getErrorMessage(err));
    }
  };

  const handleSaveEdit = async (commentId) => {
    setCommentError("");
    try {
      const updated = await updateComment(commentId, editingText);
      setComments(comments.map((item) => (item._id === commentId ? updated : item)));
      setEditingId(null);
    } catch (err) {
      setCommentError(getErrorMessage(err));
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    setCommentError("");
    try {
      await deleteComment(commentId);
      setComments(comments.filter((item) => item._id !== commentId));
    } catch (err) {
      setCommentError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <Link to={`/courses/${courseId}`} className="btn btn-outline">Go to course page</Link>
      </div>
    );
  }

  const index = lessons.findIndex((item) => item._id === lessonId);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  return (
    <div>
      <Link to={`/student/courses/${courseId}/learn`} className="small">← Back to lessons</Link>
      <h1>{lesson.title}</h1>
      {lesson.description && <p className="muted">{lesson.description}</p>}

      {lesson.videoUrl && (
        <div className="video-wrapper">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirectVideo(lesson.videoUrl) ? (
            <video src={lesson.videoUrl} controls />
          ) : (
            <p className="p-1">
              <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Open the lesson video</a>
            </p>
          )}
        </div>
      )}

      {lesson.content && (
        <article className="card card-body lesson-content pre-wrap">{lesson.content}</article>
      )}

      <div className="card card-body">
        <strong>Course progress</strong>
        <ProgressBar value={enrollment?.progress || 0} />
        <div className="btn-row">
          {PROGRESS_OPTIONS.map((value) => (
            <button
              key={value}
              className={`btn btn-sm ${enrollment?.progress === value ? "btn-primary" : "btn-outline"}`}
              onClick={() => handleProgress(value)}
            >
              {value}%
            </button>
          ))}
        </div>
      </div>

      <div className="row-between lesson-nav">
        {previous ? (
          <Link className="btn btn-outline" to={`/student/courses/${courseId}/lessons/${previous._id}`}>← Previous</Link>
        ) : <span />}
        {next ? (
          <Link className="btn btn-primary" to={`/student/courses/${courseId}/lessons/${next._id}`}>Next →</Link>
        ) : <span />}
      </div>

      <section className="section">
        <h2>Comments ({comments.length})</h2>
        <ErrorMessage message={commentError} />

        <form className="form" onSubmit={handleAddComment}>
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button className="btn btn-primary">Add comment</button>
        </form>

        {comments.length === 0 ? (
          <p className="muted">No comments yet. Be the first!</p>
        ) : (
          <ul className="list">
            {comments.map((comment) => {
              const isMine = comment.student?._id === user.id;
              return (
                <li key={comment._id} className="list-item column">
                  <div className="row-between">
                    <strong>{comment.student?.name}</strong>
                    <span className="small muted">{formatDate(comment.createdAt)}</span>
                  </div>

                  {editingId === comment._id ? (
                    <>
                      <textarea rows="3" value={editingText} onChange={(event) => setEditingText(event.target.value)} />
                      <div className="btn-row">
                        <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(comment._id)}>Save</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <p className="pre-wrap">{comment.content}</p>
                  )}

                  {isMine && editingId !== comment._id && (
                    <div className="btn-row">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditingText(comment.content);
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(comment._id)}>Delete</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default LessonDetails;
