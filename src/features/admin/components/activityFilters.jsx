import { Input, DatePicker, Select, Button } from "antd";
import { MdSearch } from "react-icons/md";

const { RangePicker } = DatePicker;

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "seller", label: "Seller" },
  { value: "customer", label: "Customer" },
];

const TARGETS = [
  { value: "product", label: "Product" },
  { value: "cart", label: "Cart" },
  { value: "order", label: "Order" },
  { value: "auth", label: "Auth" },
  { value: "chat", label: "Chat" },
];

const ActivityFilters = ({ filters, onChange, onReset }) => {
  const set = (key, value) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    };

    onChange(updatedFilters);
  };

  return (
    <div className="mb-6 grid w-full min-w-0 grid-cols-2 gap-3 rounded-xl border border-slate-500/30 bg-[var(--workspace-surface)] p-3 sm:p-4 xl:flex xl:items-center">
      <Input
        size="large"
        allowClear
        placeholder="Search by user name"
        prefix={<MdSearch size={18} />}
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        className="col-span-2 min-w-0 xl:flex-1"
      />

      <RangePicker
        size="middle"
        format="DD MMM YY"
        placeholder={["Start date", "End date"]}
        value={filters.range}
        onChange={(dates) => set("range", dates)}
        className="!h-9 !w-full min-w-0 sm:!h-10 xl:!w-64"
      />

      <Select
        size="large"
        placeholder="All roles"
        value={filters.role}
        onChange={(value) => set("role", value || "all")}
        options={[{ value: "all", label: "All roles" }, ...ROLES]}
        className="w-full min-w-0 xl:!w-36"
      />

      <Select
        size="large"
        placeholder="All targets"
        value={filters.target}
        onChange={(value) => set("target", value || "all")}
        options={[{ value: "all", label: "All targets" }, ...TARGETS]}
        className="w-full min-w-0 xl:!w-36"
      />

      <Button
        size="large"
        onClick={onReset}
        className="col-span-2 w-full xl:col-span-1 xl:!w-auto"
      >
        Reset
      </Button>
    </div>
  );
};

export default ActivityFilters;
