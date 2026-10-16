import { useDispatch } from "react-redux";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useEffect } from "react";
import { setuser } from "../store/user/userSlice";
import { RouterProvider } from "react-router-dom";
import { router } from "../router/route";
import PageLoader from "../../shared/components/pageLoader";

function AppInitializer() {
  const dispatch = useDispatch();

  const { data, isLoading } = useCurrentUser();

  useEffect(() => {
    if (data) {
      dispatch(setuser(data));
    }

  }, [data, dispatch]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default AppInitializer;
