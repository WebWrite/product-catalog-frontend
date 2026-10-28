import { useQuery } from "@tanstack/react-query";
import {
  getSellerDashboard,
  getSellerInventoryHealth,
  getSellerMonthlySales,
} from "../api/dashboard";

const DASHBOARD_QUERY_KEY = ["seller-dashboard"];
const MONTHLY_SALES_QUERY_KEY = ["seller-dashboard", "monthly-sales"];
const INVENTORY_HEALTH_QUERY_KEY = ["seller-dashboard", "inventory-health"];

export function useSellerDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getSellerDashboard,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerMonthlySales() {
  return useQuery({
    queryKey: MONTHLY_SALES_QUERY_KEY,
    queryFn: getSellerMonthlySales,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerInventoryHealth() {
  return useQuery({
    queryKey: INVENTORY_HEALTH_QUERY_KEY,
    queryFn: getSellerInventoryHealth,
    staleTime: 1000 * 60 * 2,
  });
}
