import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../../shared/utils/api";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
};
