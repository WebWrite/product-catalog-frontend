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

export async function updateSellerProductStock(productId, stock) {
  const res = await api.patch(`/seller/update-stock/${productId}`, { stock });
  return res.data;
}