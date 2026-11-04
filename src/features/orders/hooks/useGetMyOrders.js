import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/orderApi";

export const useGetMyOrders = (filters) =>
  useQuery({
    queryKey: ["my-orders", filters],
    queryFn: () => getMyOrders(filters),
    refetchOnWindowFocus: false,
  });
