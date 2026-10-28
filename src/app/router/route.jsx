import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoutes from "./protectedRoute";
import NotFound from "../../shared/components/notFound";
import ShopLayout from "../../features/shop/layouts/shopLayout";
import SellerLayout from "../../features/seller/layouts/sellerLayout";
import PageLoader from "../../shared/components/pageLoader";
import MyOrders from "../../features/orders/pages/myOrders";
import SellerOrders from "../../features/seller/pages/sellerOrders";
import PaymentSuccess from "../../features/orders/pages/paymentSuccess";
import PaymentCancelled from "../../features/orders/pages/paymentCancelled";

import AdminLayout from "../../features/admin/layout/layout";
const Chat = lazy(() => import("../../features/chat/pages/chat"));
const CustomerManagement = lazy(
  () => import("../../features/admin/pages/customer"),
);
const SellerDetail = lazy(
  () => import("../../features/admin/pages/sellerDetail"),
);
const SellerManagement = lazy(
  () => import("../../features/admin/pages/seller"),
);
const OrderDetail = lazy(
  () => import("../../features/admin/pages/orderDetails"),
);
const OrdersFulfillment = lazy(
  () => import("../../features/admin/pages/orders"),
);
const ProductCatalog = lazy(() => import("../../features/admin/pages/product"));
const UpdateAdminProduct = lazy(
  () => import("../../features/admin/pages/updateProduct"),
);
const Login = lazy(() => import("../../features/auth/pages/login"));
const Register = lazy(() => import("../../features/auth/pages/register"));
const Verification = lazy(
  () => import("../../features/auth/pages/verification"),
);

const AdminDashboard = lazy(
  () => import("../../features/admin/pages/dashboard"),
);
const SellerDashboard = lazy(
  () => import("../../features/seller/pages/dashboard"),
);
const LandingPage = lazy(() => import("../../features/shop/pages/landingPage"));
const SellerProducts = lazy(
  () => import("../../features/seller/pages/products"),
);
const AddProduct = lazy(() => import("../../features/seller/pages/addProduct"));
const EditProduct = lazy(
  () => import("../../features/seller/pages/editProduct"),
);

const ProductDetail = lazy(
  () => import("../../features/shop/pages/productDetails"),
);
const ExplorePage = lazy(() => import("../../features/shop/pages/explorePage"));
const CartPage = lazy(() => import("../../features/cart/pages/cart"));
const NewOrder = lazy(() => import("../../features/orders/pages/newOrder"));

const renderPage = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);
const chatRoutes = [
  { path: "chat", element: renderPage(Chat) },
  { path: "chat/:id", element: renderPage(Chat) },
];

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
    element: <ShopLayout>{renderPage(LandingPage)}</ShopLayout>,
  },
  {
    path: "/cart",
    element: <ShopLayout>{renderPage(CartPage)}</ShopLayout>,
  },
  {
    path: "/shop",
    element: <ShopLayout>{renderPage(ExplorePage)}</ShopLayout>,
  },
  {
    path: "/shop/:id",
    element: <ShopLayout>{renderPage(ProductDetail)}</ShopLayout>,
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
      {
        path: "products/new",
        element: renderPage(AddProduct),
      },
      {
        path: "products/edit/:productId",
        element: renderPage(EditProduct),
      },
      {
        path: "orders",
        element: renderPage(SellerOrders),
      },
      ...chatRoutes,
    ],
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoutes allowedRoles={["customer"]}>
        <ShopLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "new",
        element: renderPage(NewOrder),
      },
      {
        path: "myorders",
        element: renderPage(MyOrders),
      },
    ],
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoutes allowedRoles={["customer"]}>
        <ShopLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "success",
        element: renderPage(PaymentSuccess),
      },
      {
        path: "cancelled",
        element: renderPage(PaymentCancelled),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "dashboard",
        element: renderPage(AdminDashboard),
      },
      {
        path: "products",
        element: renderPage(ProductCatalog),
      },
      {
        path: "products/:productId/edit",
        element: renderPage(UpdateAdminProduct),
      },
      {
        path: "orders",
        element: renderPage(OrdersFulfillment),
      },
      {
        path: "orders/:orderId",
        element: renderPage(OrderDetail),
      },
      {
        path: "sellers",
        element: renderPage(SellerManagement),
      },
      {
        path: "sellers/:id",
        element: renderPage(SellerDetail),
      },
      {
        path: "customers",
        element: renderPage(CustomerManagement),
      },
      ...chatRoutes,
    ],
  },
  {
    path: "chat",
    element: renderPage(Chat),
  },
  { path: "/chat/:id", element: renderPage(Chat) },
  {
    path: "*",
    element: <NotFound />,
  },
]);
