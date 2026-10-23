import api from "../../../shared/utils/api";

const dashboardPath = "/admin/dashboard";

export async function getDashboardSummary() {
  const response = await api.get(`${dashboardPath}/summary`);
  return response.data.summary;
}

export async function getDashboardRevenue() {
  const response = await api.get(`${dashboardPath}/revenue`);
  return response.data.revenue;
}

export async function getTopCategories() {
  const response = await api.get(`${dashboardPath}/top-categories`);
  return response.data.categories;
}

export async function getAdminOrders(params = {}) {
  const response = await api.get("/admin/orders", { params });
  return response.data.orders;
}

export async function getAdminOrderSummary() {
  const response = await api.get("/admin/order-summary");
  return response.data.summary;
}

export async function getAdminOrderById(id) {
  const response = await api.get(`/admin/order/${id}`);
  return response.data.order;
}

export async function updateAdminOrderItemStatus(payload) {
  const response = await api.patch("/admin/orders/item-status", payload);
  return response.data.data.order;
}

export async function getAdminProductSummary() {
  const response = await api.get("/admin/products/summary");
  return response.data.summary;
}

export async function getAdminProducts(params = {}) {
  const response = await api.get("/", { params });
  return response.data.data;
}

export async function getAdminProductById(id) {
  const response = await api.get(`/${id}`);
  return response.data.product;
}

export async function updateAdminProduct(id, payload) {
  const response = await api.patch(`/admin/update-product/${id}`, payload);
  return response.data.product;
}

export async function deleteAdminProduct(id) {
  const response = await api.delete(`/admin/delete-product/${id}`);
  return response.data;
}

export async function getAdminSellers(params = {}) {
  const response = await api.get("/admin/sellers", { params });
  return response.data.sellers;
}

export async function getAdminSellerSummary() {
  const response = await api.get("/admin/seller-summary");
  return response.data.summary;
}

export async function getAdminSellerById(id) {
  const response = await api.get(`/admin/sellers/${id}`);
  return response.data.seller;
}

export async function updateAdminSeller(id, payload) {
  const response = await api.patch(`/admin/sellers/${id}`, payload);
  return response.data.seller;
}

export async function getAdminCustomers(params = {}) {
  const response = await api.get("/admin/customers", { params });
  return response.data.data;
}

export async function getAdminCustomerSummary() {
  const response = await api.get("/admin/customer-summary");
  return response.data.summary;
}

export async function getAdminCustomerOrders(id) {
  const response = await api.get(`/admin/customers/${id}`);
  return response.data.data;
}

export async function updateAdminCustomer(id, payload) {
  const response = await api.patch(`/admin/customers/${id}`, payload);
  return response.data.customer;
}
