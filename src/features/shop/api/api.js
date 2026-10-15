import api from "../../../shared/utils/api";

export const getProducts = async (filters) => {
  let res = await api.get("", {
    params: {
      search: filters.keyword || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock || undefined,
      sortBy: filters.sortby,
      page: filters.page,
      limit: filters.limit,
    },
  });
  return res.data;
};

export const getProductsById = async (id) => {
  let res = await api.get(`/${id}`);
  return res.data.product;
};
