import api from "../../../shared/utils/api";

export async function getSellerDashboard() {
  const res = await api.get("/seller/dashboard");
  return res.data.data;
}

export async function getSellerMonthlySales() {
  const res = await api.get("/seller/sales/monthly");
  return res.data.data.sales;
}

export async function getSellerInventoryHealth() {
  const res = await api.get("/seller/inventory-health");
  return res.data.data;
}
