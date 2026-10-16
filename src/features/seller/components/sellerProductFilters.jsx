
import { useEffect, useState } from "react";
import { Input, Select } from "antd";
import { MdSearch } from "react-icons/md";
import { PRODUCT_CATEGORIES } from "../constants/productConstants";

const categories =PRODUCT_CATEGORIES;
const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Price: Low to high", value: "price-low" },
  { label: "Price: High to low", value: "price-high" },
  { label: "Name: A-Z", value: "a-z" },
  { label: "Name: Z-A", value: "z-a" },
];

export default function SellerProductFilters({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: search.trim() });
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Input
        allowClear
        prefix={<MdSearch className="text-slate-400" />}
        placeholder="Search products..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="h-10 sm:flex-1"
      />

      <Select
        allowClear
        placeholder="All categories"
        value={filters.category || undefined}
        options={categories.map((category) => ({
          label: category,
          value: category,
        }))}
        onChange={(category) =>
          onChange({ ...filters, category: category || "" })
        }
        className="w-full sm:w-48 h-10"
      />

      <Select
        value={filters.sortBy}
        options={sortOptions}
        onChange={(sortBy) => onChange({ ...filters, sortBy })}
        className="w-full sm:w-52 h-10"
      />
    </div>
  );
}
