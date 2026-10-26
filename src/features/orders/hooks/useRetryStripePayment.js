import { useMutation } from "@tanstack/react-query";
import { retryStripePayment } from "../api/orderApi";

export const useRetryStripePayment = () =>
  useMutation({
    mutationFn: retryStripePayment,
    onSuccess: ({ checkoutUrl }) => {
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
      }
    },
  });
