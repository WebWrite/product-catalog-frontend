import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getMe, refreshToken } from "../../../shared/utils/api";
import { hasLoginMarker } from "../../../shared/utils/authStorage";

export const fetchCurrentUser = async () => {
  const refreshed = await refreshToken();

  if (!refreshed) {
    throw new Error("Unable to refresh authentication");
  }

  return getMe();
};

export const useCurrentUser = () => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = hasLoginMarker() || !!user?.email;

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: isLoggedIn,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
