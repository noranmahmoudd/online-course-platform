import { NavLink, Outlet } from "react-router-dom";

const StudentLayout = () => (
  <div className="container dashboard-layout">
    <aside className="sidebar">
      <h4>Student</h4>
      <NavLink to="/student/dashboard">Dashboard</NavLink>
      <NavLink to="/student/my-courses">My Courses</NavLink>
      <NavLink to="/courses">Browse Courses</NavLink>
      <NavLink to="/student/profile">Profile</NavLink>
    </aside>
    <section className="dashboard-content">
      <Outlet />
    </section>
  </div>
);

export default StudentLayout;
