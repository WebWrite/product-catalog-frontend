import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  addToCart,
  deleteAllCart,
  deleteCartItem,
  editItem,
  getCart,
} from "../api/cartApi";
import { notification } from "antd";
import { getProductsById } from "../../shop/api/api";

export const useCartQuery = () => {
  const user = useSelector((state) => state.user);
  const isCustomer = !!user?.email && user?.role === "customer";

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isCustomer,
    refetchOnWindowFocus: false,
  });
};

const useCartMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (mutationFn !== addToCart) return undefined;

      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (current) => {
        const data = current ?? { success: true, cart: { items: [] } };
        const items = data.cart?.items ?? [];
        const existing = items.find(
          (item) =>
            (item.productId?._id ?? item.productId) === variables.id &&
            (item.size ?? null) === (variables.size ?? null),
        );

        const nextItems = existing
          ? items.map((item) =>
              item === existing
                ? {
                    ...item,
                    quantity: Number(item.quantity ?? 0) + variables.quantity,
                  }
                : item,
            )
          : [
              ...items,
              {
                _id: `optimistic-${variables.id}-${variables.size ?? "default"}`,
                productId: variables.product ?? variables.id,
                quantity: variables.quantity,
                size: variables.size ?? null,
              },
            ];

        return { ...data, cart: { ...(data.cart ?? {}), items: nextItems } };
      });

      return { previousCart, hadPreviousCart: previousCart !== undefined };
    },
    onError: (error, _variables, context) => {
      if (context?.hadPreviousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      } else if (context) {
        queryClient.removeQueries({ queryKey: ["cart"], exact: true });
      }
      notification.error({
        description: error.response?.data?.message || "something went worng",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.refetchQueries({
          queryKey: ["currentUser"],
          type: "active",
        }),
      ]);
    },
  });
};

export const useAddToCart = () => useCartMutation(addToCart);
export const useEditItem = () => useCartMutation(editItem);
export const useDeleteItem = () => useCartMutation(deleteCartItem);
export const useDeleteCart = () => useCartMutation(deleteAllCart);

export const useGuestCartProducts = () => {
  const isLoggedIn = useSelector((s) => !!s.user?.email);
  const items = useSelector((s) => s.cart.items);
  const ids = [...new Set(items.map((i) => i.productId))].sort();

  return useQuery({
    queryKey: ["guest-cart-products", ids],
    queryFn: async () => {
      const responses = await Promise.all(ids.map((id) => getProductsById(id)));
      return responses.map((response) => response?.data ?? response);
    },
    enabled: !isLoggedIn && ids.length > 0,
  });
};
