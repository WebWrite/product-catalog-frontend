import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/auth/pages/login";
import Register from "../../features/auth/pages/register";
import Verification from "../../features/auth/pages/verification";
import ProtectedRoutes from "./protectedRoute";
import AdminDashboard from "../../features/admin/pages/dashboard";
import SellerDashboard from "../../features/seller/pages/dashboard";
import NotFound from "../../shared/components/notFound";
import LandingPage from "../../features/shop/pages/landingPage";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },

  {
    path: "/auth/verify-otp",
    element: <Verification />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
  },

  {
    path: "/seller/dashboard",
    element: (
      <ProtectedRoutes allowedRoles={["seller"]}>
        <SellerDashboard />
      </ProtectedRoutes>
    ),
  },

  {
    path: "/cart",
    element: (
      <ProtectedRoutes allowedRoles={["buyer"]}>
        <Login />
      </ProtectedRoutes>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
