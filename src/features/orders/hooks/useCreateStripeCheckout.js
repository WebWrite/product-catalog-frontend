import { useMutation } from "@tanstack/react-query";
import { createStripeCheckout } from "../api/orderApi";

export const useCreateStripeCheckout = () => {
  return useMutation({
    mutationFn: createStripeCheckout,
  });
};
