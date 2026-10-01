import { NavLink, Outlet } from "react-router-dom";

const InstructorLayout = () => (
  <div className="container dashboard-layout">
    <aside className="sidebar">
      <h4>Instructor</h4>
      <NavLink to="/instructor/dashboard">Dashboard</NavLink>
      <NavLink to="/instructor/courses" end>My Courses</NavLink>
      <NavLink to="/instructor/courses/new">Create Course</NavLink>
      <NavLink to="/instructor/profile">Profile</NavLink>
    </aside>
    <section className="dashboard-content">
      <Outlet />
    </section>
  </div>
);

export default InstructorLayout;
