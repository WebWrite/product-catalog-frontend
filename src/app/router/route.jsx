import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/auth/pages/login";
import Register from "../../features/auth/pages/register";
import Verification from "../../features/auth/pages/verification";

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
    path: "/auth/verify",
    element: <Verification />,
  },
]);
