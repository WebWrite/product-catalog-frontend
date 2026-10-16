import api from "../../../shared/utils/api";


export async function getSellerProducts() {
  const res = await api.get("/seller/products");
  return res.data.data;
}


export async function createSellerProduct(payload) {
  const formData = new FormData();

  formData.append("category", payload.category);
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("stock", payload.stock);
  formData.append("status", payload.status);

  if (payload.sizes?.length) {
    payload.sizes.forEach((s) => formData.append("sizes[]", s));
  }

  formData.append("image", payload.image);

  const res = await api.post("/seller/add-product", formData);
  return res.data.data;
}


export async function deleteSellerProduct(productId) {
  const res = await api.delete(`/seller/delete-product/${productId}`);
  return res.data;
}
export async function updateSellerProduct({ productId, data }) {
  const formData = new FormData();

  formData.append("category", data.category);
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("stock", String(data.stock));
  formData.append("status", data.status);

(data.sizes ?? []).forEach((size) => {
  formData.append("sizes", size);
});
  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await api.patch(
    `/seller/update-product/${productId}`,
    formData,
  );

  return res.data.data;
}

export async function updateSellerProductStock(productId, stock) {
  const res = await api.patch(`/seller/update-stock/${productId}`, { stock });
  return res.data;
}


export async function bulkDeleteSellerProducts(productIds) {
  const res = await api.delete("/seller/bulk-delete", {
    data: { productIds },
  });

  return res.data;
}
