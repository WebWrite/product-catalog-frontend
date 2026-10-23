
import { useMutation } from "@tanstack/react-query";
import { createCODOrder } from "../api/orderApi";

export const useCreateCODOrder = () => {
  return useMutation({
    mutationFn: createCODOrder,
  });
};
