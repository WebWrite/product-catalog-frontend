import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
  updateSellerProductStock,
  updateSellerProduct,
  bulkDeleteSellerProducts,
} from "../api/products";
const QUERY_KEY = ["seller-products"];

export function useSellerProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSellerProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSellerProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSellerProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateSellerStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock }) =>
      updateSellerProductStock(productId, stock),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}


export function useBulkDeleteSellerProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteSellerProducts,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      }),
  });
}
