import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { setuser } from "../store/user/userSlice";
import { router } from "../router/route";

import { hasLoginMarker } from "../../shared/utils/authStorage";
import PageLoader from "../../shared/components/pageLoader";
import { useChatSocket } from "../../features/chat/hooks/useChat";

function AppInitializer() {
  const dispatch = useDispatch();

  const { data, isLoading } = useCurrentUser();
  const isLoggedIn = hasLoginMarker();
  useChatSocket();

  useEffect(() => {
    if (data) {
      dispatch(setuser(data));
    }
  }, [data, dispatch]);

  if (isLoggedIn && isLoading) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default AppInitializer;
