import {
  MdOutlineInventory,
  MdOutlinePendingActions,
  MdAttachMoney,
  MdWarningAmber,
} from "react-icons/md";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/statCard";
import PriorityQueueTable from "../components/priorityQueueTable";
import InventoryDonut from "../components/inventoryDonut";
import { money } from "../../../shared/utils/currency";
import {
  useSellerDashboard,
  useSellerInventoryHealth,
  useSellerMonthlySales,
} from "../hooks/useSellerDashboard";
import { notification } from "antd";
import { useEffect } from "react";

function SellerDashboard() {
  const dashboardQuery = useSellerDashboard();
  const monthlySalesQuery = useSellerMonthlySales();
  const inventoryHealthQuery = useSellerInventoryHealth();

  const dashboard = dashboardQuery.data ?? {};
  const chartData = (monthlySalesQuery.data ?? []).map((item) => ({
    ...item,
    name: `${item.month} ${item.year}`,
  }));
  const hasError =
    dashboardQuery.isError ||
    monthlySalesQuery.isError ||
    inventoryHealthQuery.isError;
  useEffect(() => {
    if (hasError) {
      notification.error({
        key: "seller-dashboard-error",
        title: "Could not load data",
        description: "Failed to load the data, please refresh.",
        placement: "bottomRight",
        showProgress: true,
        pauseOnHover: true,
      });
    }
  }, [hasError]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full min-w-0 max-w-[1600px] mx-auto p-4 sm:p-8 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div className="w-full md:w-auto min-w-0">
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-bold text-slate-100 m-0 tracking-tight">
            Welcome back, Seller
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4 w-full min-w-0">
        <StatCard
          title="Total Cataloged"
          value={
            dashboardQuery.isLoading
              ? "..."
              : (dashboard.totalCatalogedProducts ?? 0)
          }
          subtext="Products"
          icon={<MdOutlineInventory size={20} />}
        />
        <StatCard
          title="Total Orders"
          value={
            dashboardQuery.isLoading ? "..." : (dashboard.totalOrders ?? 0)
          }
          icon={<MdOutlinePendingActions size={20} />}
        />
        <StatCard
          title="Total Sales "
          value={
            dashboardQuery.isLoading ? "..." : money(dashboard.totalSales ?? 0)
          }
          icon={<MdAttachMoney size={20} />}
        />
        <StatCard
          title="Low Stock Critical"
          value={
            dashboardQuery.isLoading
              ? "..."
              : (dashboard.lowStockCriticalItemCount ?? 0)
          }
          subtext="Items"
          isAlert={true}
          icon={<MdWarningAmber size={20} />}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-5 w-full min-w-0">
        <div
          className="p-3 md:p-4 lg:p-6 rounded-2xl border border-slate-800 flex-[2] shadow-sm min-w-0"
          style={{ background: "var(--workspace-surface)" }}
        >
          <div className="flex flex-col mb-4 sm:flex-row justify-between items-start sm:items-center  md:mb-8 gap-3">
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-bold m-0 text-slate-100 tracking-tight">
                Sales & Order Volume
              </h3>
            </div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    background: "#1E293B",
                    color: "#F1F5F9",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#818CF8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <InventoryDonut
          data={inventoryHealthQuery.data}
          isLoading={inventoryHealthQuery.isLoading}
        />
      </div>

      <PriorityQueueTable />
    </div>
  );
}

export default SellerDashboard;
