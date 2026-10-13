import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes({ allowedRoles, children }) {
  let user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to={"/auth/login"} />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/auth/login"} />;
  }

  return children || <Outlet />;
}

export default ProtectedRoutes;
