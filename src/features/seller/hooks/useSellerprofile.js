import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSellerProfile,
  updateSellerProfile,
  changeSellerPassword,
} from "../api/profile";

export const useGetSellerProfile = () =>
  useQuery({
    queryKey: ["seller-profile"],
    queryFn: getSellerProfile,
    refetchOnWindowFocus: false,
  });

export const useUpdateSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["seller-profile"],
      }),
  });
};

export const useChangeSellerPassword = () =>
  useMutation({
    mutationFn: changeSellerPassword,
  });
