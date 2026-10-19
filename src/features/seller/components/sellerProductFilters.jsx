import { useEffect, useState } from "react";
import { Input, Select } from "antd";
import { MdSearch } from "react-icons/md";
import { PRODUCT_CATEGORIES, PRODUCT_SORT_OPTIONS } from "../constants/productConstants";

const CATEGORIES = PRODUCT_CATEGORIES

const SORT_OPTIONS = PRODUCT_SORT_OPTIONS

function SellerProductFilters({ filters, onChange }) {
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

  return (
    <div className="mb-1 flex flex-col gap-3 sm:flex-row">
      <Input
        allowClear
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search products..."
        prefix={<MdSearch className="text-lg text-slate-400" />}
        className="md:h-10 sm:max-w-xs"
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
        className="w-full  sm:min-w-44 sm:flex-1"
      />

      <Select
        value={filters.sortBy}
        onChange={(sortBy) => onChange({ sortBy })}
        options={SORT_OPTIONS}
        className="w-full sm:min-w-48 sm:flex-1"
      />
    </div>
  );
}

export default SellerProductFilters;