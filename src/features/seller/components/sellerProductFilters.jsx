import { useEffect, useState } from "react";
import { Input, Select, theme } from "antd";
import { MdSearch } from "react-icons/md";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
} from "../constants/productConstants";

const CATEGORIES = PRODUCT_CATEGORIES;
const SORT_OPTIONS = PRODUCT_SORT_OPTIONS;

const STOCK_OPTIONS = [
  { label: "All stock", value: "" },
  { label: "In Stock", value: "inStock" },
  { label: "Low Stock", value: "lowStock" },
  { label: "Dead Stock", value: "deadStock" },
];

function SellerProductFilters({ filters, onChange }) {
  const { token } = theme.useToken();
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const search = searchInput.trim();

      if (search !== filters.search) {
        onChange({ search });
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search, onChange]);

  const controlStyle = {
    height: 40,
    borderColor: token.colorBorder,
    color: token.colorText,
  };

  return (
    <div className="mb-1 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Input
        allowClear
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search products..."
        prefix={<MdSearch className="text-lg" />}
        className="filter-control h-10 w-full min-w-0"
        style={controlStyle}
      />

      <Select
        value={filters.category || undefined}
        onChange={(category) => onChange({ category: category || "" })}
        placeholder="All categories"
        allowClear
        options={CATEGORIES.map((category) => ({
          label: category,
          value: category,
        }))}
        className="filter-control h-10 w-full min-w-0"
        style={controlStyle}
      />

      <Select
        value={filters.sortBy}
        onChange={(sortBy) => onChange({ sortBy })}
        options={SORT_OPTIONS}
        className="filter-control h-10 w-full min-w-0"
        style={controlStyle}
      />

      <Select
        value={filters.stockStatus || undefined}
        onChange={(stockStatus) => onChange({ stockStatus: stockStatus || "" })}
        placeholder="All stock"
        allowClear
        options={STOCK_OPTIONS}
        className="filter-control h-10 w-full min-w-0"
        style={controlStyle}
      />
    </div>
  );
}

export default SellerProductFilters;
