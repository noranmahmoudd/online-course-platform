import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/courses", label: "Courses" },
  ];

  if (!isAuthenticated) {
    links.push({ to: "/login", label: "Login" }, { to: "/register", label: "Register" });
  } else if (user.role === "student") {
    links.push(
      { to: "/student/my-courses", label: "My Courses" },
      { to: "/student/dashboard", label: "Dashboard" },
      { to: "/student/profile", label: "Profile" }
    );
  } else {
    links.push(
      { to: "/instructor/dashboard", label: "Dashboard" },
      { to: "/instructor/courses", label: "My Courses" },
      { to: "/instructor/courses/new", label: "Create Course" },
      { to: "/instructor/profile", label: "Profile" }
    );
  }

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          Learn<span>Hub</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
