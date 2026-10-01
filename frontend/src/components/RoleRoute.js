import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ role }) => {
  const { user } = useAuth();

  if (user.role !== role) {
    const home = user.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard";
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
};

export default RoleRoute;
