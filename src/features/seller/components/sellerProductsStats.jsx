import {
  MdInventory2,
  MdCheckCircle,
  MdError,
  MdWarning,
} from "react-icons/md";
import StatCard from "./statCard";

function SellerProductsStats({ stats, isLoading, isError }) {
  const getValue = (value) =>
    isLoading ? "..." : isError ? "—" : (value ?? 0);

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard
        title="Total Products"
        value={getValue(stats?.totalProducts)}
        icon={<MdInventory2 size={18} />}
      />

      <StatCard
        title="Active Products"
        value={getValue(stats?.activeProducts)}
        icon={<MdCheckCircle size={18} />}
        iconClassName="bg-green-600/30 text-green-400"
      />

      <StatCard
        title="Dead Stock Products"
        value={getValue(stats?.deadStockProducts)}
        icon={<MdError size={18} />}
        iconClassName="bg-red-500/30 text-red-400"
        isAlert
      />

      <StatCard
        title="Low Stock Products"
        value={getValue(stats?.lowStockProducts)}
        icon={<MdWarning size={18} />}
        iconClassName="bg-yellow-600/30 text-yellow-400"
      />
    </div>
  );
}

export default SellerProductsStats;
