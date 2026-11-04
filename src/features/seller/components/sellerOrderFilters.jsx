import { useEffect, useState } from "react";
import { Input, Select } from "antd";
import { MdSearch } from "react-icons/md";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const PAYMENT_METHODS = [
  { label: "All methods", value: "" },
  { label: "COD", value: "COD" },
  { label: "Stripe", value: "STRIPE" },
];

const PAYMENT_STATUSES = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const SellerOrderFilters = ({ filters, onChange }) => {
  const [keyword, setKeyword] = useState(filters.search);
  const debouncedSearch = useDebounce(keyword, 350);
  useEffect(() => {
    setKeyword(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const search = debouncedSearch.trim();
    if (search !== filters.search) {
      onChange({ search });
    }
  }, [debouncedSearch, filters.search, onChange]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
      <div className="col-span-2 lg:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Search
        </label>

        <Input
          allowClear
          size="large"
          variant="filled"
          placeholder="Customer name or email"
          prefix={<MdSearch className="text-lg text-slate-500" />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Payment Method
        </label>

        <Select
          className="w-full"
          size="large"
          value={filters.paymentMethod}
          options={PAYMENT_METHODS}
          onChange={(value) => onChange({ paymentMethod: value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          Payment Status
        </label>

        <Select
          className="w-full"
          size="large"
          value={filters.paymentStatus}
          options={PAYMENT_STATUSES}
          onChange={(value) => onChange({ paymentStatus: value })}
        />
      </div>
    </div>
  );
};

export default SellerOrderFilters;
