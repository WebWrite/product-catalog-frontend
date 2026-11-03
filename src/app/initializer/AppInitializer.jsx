import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { setuser, removeUser } from "../store/user/userSlice";
import { router } from "../router/route";

import {
  clearLoginMarker,
  hasLoginMarker,
} from "../../shared/utils/authStorage";
import PageLoader from "../../shared/components/pageLoader";
import { useChatSocket } from "../../features/chat/hooks/useChat";

function AppInitializer() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { data, isLoading, isError } = useCurrentUser();
  const isLoggedIn = hasLoginMarker();
  useChatSocket();

  useEffect(() => {
    if (data) {
      dispatch(setuser(data));
    } else if (isError && isLoggedIn && !user) {
      dispatch(removeUser());
      clearLoginMarker();
    }
  }, [data, isError, isLoggedIn, user, dispatch]);

  if (isLoggedIn && isLoading) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default AppInitializer;
