import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";


import ProtectedRoutes from "./protectedRoute";
import NotFound from "../../shared/components/notFound";
import ShopLayout from "../../features/shop/layouts/shopLayout";
import SellerLayout from "../../features/seller/layouts/sellerLayout";
import PageLoader from "../../shared/components/pageLoader";

const Login = lazy(() => import("../../features/auth/pages/login"));
const Register = lazy(() => import("../../features/auth/pages/register"));
const Verification = lazy(() => import("../../features/auth/pages/verification"));

const AdminDashboard = lazy(() => import("../../features/admin/pages/dashboard"));
const SellerDashboard = lazy(() => import("../../features/seller/pages/dashboard"));
const LandingPage = lazy(() => import("../../features/shop/pages/landingPage"));
const SellerProducts = lazy(() => import("../../features/seller/pages/products"));
const AddProduct = lazy(() => import("../../features/seller/pages/addProduct"));
const EditProduct = lazy(() => import("../../features/seller/pages/editProduct"));

const renderPage = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: renderPage(Login),
  },
  {
    path: "/auth/register",
    element: renderPage(Register),
  },

  {
    path: "/auth/verify-otp",
    element: renderPage(Verification),
  },
  {
    path: "/",
    element: (
      <ShopLayout>
        {renderPage(LandingPage)}
      </ShopLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <ShopLayout>
        <CartPage />
      </ShopLayout>
    ),
  },
  {
    path: "/shop",
    element: (
      <ShopLayout>
        <ExplorePage />
      </ShopLayout>
    ),
  },

  {
    path: "/shop/:id",
    element: (
      <ShopLayout>
        <ProductDetail />
      </ShopLayout>
    ),
  },

  {
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [{ path: "/admin/dashboard", element: renderPage(AdminDashboard) }],
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
        element: renderPage(SellerDashboard),
      },
      {
        path: "products",
        element: renderPage(SellerProducts),
      },
      { path: "products/new", element: renderPage(AddProduct) },
      { path: "products/edit/:productId", element: renderPage(EditProduct) }
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
