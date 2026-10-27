import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
  updateSellerProductStock,
  updateSellerProduct,
  bulkDeleteSellerProducts,
  getSellerProductStats,
} from "../api/products";
import { getSellerOrders, updateSellerOrderStatus } from "../api/orders";

const QUERY_KEY = ["seller-products"];
const STATS_QUERY_KEY = ["seller-product-stats"];
const ORDERS_QUERY_KEY = ["seller-orders"];

export function useSellerProducts(filters) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => getSellerProducts(filters),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSellerProduct,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSellerProduct,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}

export function useUpdateSellerStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock }) =>
      updateSellerProductStock(productId, stock),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerProduct,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}

export function useBulkDeleteSellerProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteSellerProducts,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}

export function useSellerProductStats() {
  return useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: getSellerProductStats,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });
}

export function useSellerOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getSellerOrders,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerOrderStatus,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY }),
      ]);
    },
  });
}
