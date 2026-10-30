import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getMe } from "../../../shared/utils/api";
import { hasLoginMarker } from "../../../shared/utils/authStorage";

export const fetchCurrentUser = async () => {
  return getMe();
};

export const useCurrentUser = () => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = hasLoginMarker() || !!user?.email;

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: isLoggedIn,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
