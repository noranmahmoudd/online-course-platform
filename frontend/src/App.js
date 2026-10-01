import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/public/Home";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import LearningPage from "./pages/student/LearningPage";
import LessonDetails from "./pages/student/LessonDetails";
import Profile from "./pages/student/Profile";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import CourseLessons from "./pages/instructor/CourseLessons";
import CreateLesson from "./pages/instructor/CreateLesson";
import EditLesson from "./pages/instructor/EditLesson";

const NotFound = () => (
  <div className="container page empty-state">
    <h2>404 - Page not found</h2>
    <p className="muted">The page you are looking for does not exist.</p>
  </div>
);

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="student" />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses/:courseId/learn" element={<LearningPage />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<LessonDetails />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role="instructor" />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="courses/new" element={<CreateCourse />} />
            <Route path="courses/:id/edit" element={<EditCourse />} />
            <Route path="courses/:id/lessons" element={<CourseLessons />} />
            <Route path="courses/:id/lessons/new" element={<CreateLesson />} />
            <Route path="lessons/:lessonId/edit" element={<EditLesson />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
