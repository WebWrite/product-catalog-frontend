import { useQuery } from "@tanstack/react-query";
import { getSellerProfile } from "../api/profile";

export const useGetSellerProfile = () =>
  useQuery({
    queryKey: ["seller-profile"],
    queryFn: getSellerProfile,
  });
