import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/orderApi";

export const useGetMyOrders = () =>
  useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });
