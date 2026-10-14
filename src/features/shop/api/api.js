import api from "../../../shared/utils/api";

export const getProducts = async () => {
  let res = await api.get();
  return res.data;
};

export const getProductsById = async (id) => {
  let res = await api.get(`/${id}`);
  return res.data.product;
};
