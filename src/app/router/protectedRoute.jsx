import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import PageLoader from "../../shared/components/pageLoader";

function ProtectedRoutes({ allowedRoles, children }) {
  const storedUser = useSelector((state) => state.user);
  const { data: fetchedUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <PageLoader />;
  }

  const user = storedUser || fetchedUser;

  if (!user) {
    return <Navigate to={"/auth/login"} />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/auth/login"} />;
  }

  return children || <Outlet />;
}

export default ProtectedRoutes;
