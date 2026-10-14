import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/auth/pages/login";
import Register from "../../features/auth/pages/register";
import Verification from "../../features/auth/pages/verification";
import ProtectedRoutes from "./protectedRoute";
import AdminDashboard from "../../features/admin/pages/dashboard";
import SellerDashboard from "../../features/seller/pages/dashboard";
import NotFound from "../../shared/components/notFound";
import LandingPage from "../../features/shop/pages/landingPage";
import ShopLayout from "../../features/shop/layouts/shopLayout";
import SellerLayout from "../../features/seller/layouts/sellerLayout";
import SellerProducts from "../../features/seller/pages/products";
import AddProduct from "../../features/seller/pages/addProduct";


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
    element: (
      <ShopLayout>
        <LandingPage />
      </ShopLayout>
    ),
  },

  {
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
  },

  {
    path: "/seller",
    element: (
      <ProtectedRoutes allowedRoles={["seller"]}>
        <SellerLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "products",
        element: <SellerProducts />,
      },
      { path: "products/new", element: <AddProduct /> },
    ],
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoutes allowedRoles={["customer"]}>
        <Login />
      </ProtectedRoutes>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
