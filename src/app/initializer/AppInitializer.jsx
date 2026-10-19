import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { setuser, removeUser, setCheckingAuth } from "../store/user/userSlice";

import { router } from "../router/route";
import PageLoader from "../../shared/components/pageLoader";

function AppInitializer() {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useCurrentUser();

  const isCheckingAuth = useSelector((state) => state.user.isCheckingAuth);

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      dispatch(setuser(data));
    } else if (isError || !data) {
      dispatch(removeUser());
    }

    dispatch(setCheckingAuth(false));
  }, [data, isLoading, isError, dispatch]);

  if (isLoading || isCheckingAuth) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default AppInitializer;
