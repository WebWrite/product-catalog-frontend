import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  addToCart,
  deleteAllCart,
  deleteCartItem,
  editItem,
  getCart,
} from "../api/cartApi";
import { message, notification } from "antd";
import { getProductsById } from "../../shop/api/api";

export const useCartQuery = () => {
  const isLoggedIn = useSelector((state) => !!state.user?.email);

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isLoggedIn,
  });
};

const useCartMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      message.open({
        type: "success",
        content: "Added to cart",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
      ]);
    },

    onError: (error) =>
      notification.error({
        description: error.response?.data?.message || "something went worng",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      }),
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
      console.log(responses);

      return responses.map((response) => response?.data ?? response);
    },
    enabled: !isLoggedIn && ids.length > 0,
  });
};
