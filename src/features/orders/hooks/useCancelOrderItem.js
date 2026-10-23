import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrderItem } from "../api/orderApi";

export const useCancelOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrderItem,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["my-orders"] }),
  });
};
