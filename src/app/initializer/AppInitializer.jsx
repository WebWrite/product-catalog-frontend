import { useDispatch } from "react-redux";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useEffect } from "react";
import { removeUser, setuser } from "../store/user/userSlice";
import { RouterProvider } from "react-router-dom";
import { router } from "../router/route";

function AppInitializer() {
  const dispatch = useDispatch();

  const { data, isError } = useCurrentUser();

  useEffect(() => {
    if (data) {
      dispatch(setuser(data));
    }

    if (isError) {
      dispatch(removeUser());
    }
  }, [data, isError, dispatch]);

  return <RouterProvider router={router} />;
}

export default AppInitializer;
