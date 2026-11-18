import api from "../../../shared/utils/api";

export const getProducts = async (filters = {}, signal) => {
  let res = await api.get("", {
    params: {
      search: filters.keyword || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock || undefined,
      sortBy: filters.sortBy,
      page: filters.page,
      limit: filters.limit,
    },
    signal,
  });
  return res.data;
};

export const getProductsById = async (id, signal) => {
  let res = await api.get(`/${id}`, { signal });
  return res.data.product;
};
