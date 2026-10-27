import { IoCartOutline } from "react-icons/io5";
import AnalyticalCard from "../components/analyticalCard";
import { GrCurrency } from "react-icons/gr";
import { BsShop } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import TopSelling from "../components/topSelling";
import RevenueChart from "../components/revenueChart";
import RecentOrder from "../components/recentOrder";
import { money } from "../../../shared/utils/currency";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminOrders,
  getDashboardRevenue,
  getDashboardSummary,
  getTopCategories,
} from "../api/api";

function AdminDashboard() {
  const summaryQuery = useQuery({
    queryKey: ["admin", "dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
  const revenueQuery = useQuery({
    queryKey: ["admin", "dashboard", "revenue"],
    queryFn: getDashboardRevenue,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "dashboard", "top-categories"],
    queryFn: getTopCategories,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", { page: 1, limit: 10 }],
    queryFn: () => getAdminOrders({ page: 1, limit: 10 }),
  });

  const summary = summaryQuery.data ?? {};
  const errors = [
    summaryQuery,
    revenueQuery,
    categoriesQuery,
    ordersQuery,
  ].filter((query) => query.isError);
  const revenue = (revenueQuery.data ?? []).map((item) => ({
    date: item.date,
    day: new Date(`${item.date}T00:00:00`).getDate(),
    revenue: item.totalPrice,
    orders: item.totalOrders,
  }));
  const categories = categoriesQuery.data ?? [];
  const totalCategorySales = categories.reduce(
    (total, category) => total + category.totalSales,
    0,
  );
  const categoryData = categories.map((category, index) => ({
    name: category.category,
    percent: totalCategorySales
      ? Math.round((category.totalSales / totalCategorySales) * 100)
      : 0,
    amount: category.totalSales,
    color: ["#2e1fb0", "#6d3df0", "#8b5cf6", "#c4b5fd"][index % 4],
  }));

  return (
    <div className="theme-page min-h-screen p-4 sm:p-8  ">
      {errors.length > 0 && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Some dashboard data could not be loaded. Please refresh and try again.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        <AnalyticalCard
          amount={
            summaryQuery.isLoading ? "..." : money(summary.grossValue ?? 0)
          }
          icon={<GrCurrency className="size-5" />}
          title={"Total Sales"}
        />
        <AnalyticalCard
          amount={summaryQuery.isLoading ? "..." : (summary.totalOrder ?? 0)}
          icon={<IoCartOutline className="size-5" />}
          title={"Total Orders"}
        />{" "}
        <AnalyticalCard
          amount={summaryQuery.isLoading ? "..." : (summary.totalSeller ?? 0)}
          icon={<BsShop className="size-5" />}
          title={"Total Sellers"}
        />{" "}
        <AnalyticalCard
          amount={
            summaryQuery.isLoading ? "..." : (summary.totalRgisterAccount ?? 0)
          }
          icon={<HiOutlineUsers className="size-5" />}
          title={"Registered Customers"}
        />
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-4 xl:gap-3">
        <div className="min-w-0 xl:col-span-3">
          <RevenueChart data={revenue} isLoading={revenueQuery.isLoading} />
        </div>
        <TopSelling
          categories={categoryData}
          isLoading={categoriesQuery.isLoading}
        />
      </div>

      <div className="mt-3">
        <RecentOrder
          orders={ordersQuery.data?.orders ?? []}
          isLoading={ordersQuery.isLoading}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
