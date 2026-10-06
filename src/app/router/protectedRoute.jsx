import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes({ allowedRoles }) {
  let user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to={"/auth/login"} />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/auth/login"} />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
