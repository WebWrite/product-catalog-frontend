import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Badge, Drawer, Pagination, Select } from "antd";
import { BsPatchCheck } from "react-icons/bs";
import { MdFilterList, MdOutlineSort } from "react-icons/md";
import CustomTag from "../../../shared/components/customTag";
import CustomButton from "../../../shared/components/customButton";
import FilterTag from "../components/filtertag";
import FilterSidebar from "../components/filterSide";
import ProductCard from "../../../shared/components/product";
import { getProducts } from "../api/api";
import { money } from "../../../shared/utils/currency";
import {
  CATEGORIES,
  DEFAULT_FILTERS,
  getBadge,
  PAGE_SIZE,
  PRICE_MAX,
  PRICE_MIN,
} from "../utils/constant";

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("search") || "",
    category: searchParams.get("category"),
    minPrice: Number(searchParams.get("minPrice")) || PRICE_MIN,
    maxPrice: Number(searchParams.get("maxPrice")) || PRICE_MAX,
    inStock: searchParams.get("inStock") === "true",
    sortBy: searchParams.get("sortBy") || "low-to-high",
    page: Number(searchParams.get("page")) || 1,
  });

  const updateFilters = (patch) =>
    setFilters((prev) => ({ ...prev, page: 1, ...patch }));
  const clearAll = () => setFilters(DEFAULT_FILTERS);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("search", filters.keyword);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice !== PRICE_MIN)
      params.set("minPrice", filters.minPrice);
    if (filters.maxPrice !== PRICE_MAX)
      params.set("maxPrice", filters.maxPrice);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.page > 1) params.set("page", filters.page);
    setSearchParams(params, { replace: true });
  }, [filters]);

  const [debouncedKeyword, setDebouncedKeyword] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(filters.keyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.keyword]);

  const queryFilters = {
    ...filters,
    keyword: debouncedKeyword,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", queryFilters],
    queryFn: () => getProducts({ ...queryFilters, limit: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  const activeFilters = [];

  if (filters.keyword) {
    activeFilters.push({
      id: "keyword",
      text: `"${filters.keyword}"`,
      onRemove: () => updateFilters({ keyword: "" }),
    });
  }

  if (filters.category) {
    activeFilters.push({
      id: "category",
      text: CATEGORIES.find((c) => c.value === filters.category)?.label,
      onRemove: () => updateFilters({ category: null }),
    });
  }

  if (filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX) {
    activeFilters.push({
      id: "price",
      text: `Rs ${filters.minPrice} - ${filters.maxPrice}`,
      onRemove: () =>
        updateFilters({ minPrice: PRICE_MIN, maxPrice: PRICE_MAX }),
    });
  }

  if (filters.inStock) {
    activeFilters.push({
      id: "inStock",
      text: "In Stock",
      onRemove: () => updateFilters({ inStock: false }),
    });
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl  p-3 sm:p-4 md:p-6">
      <div className="mb-4 mt-2 flex flex-col gap-3 p-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="m-0 text-xl font-semibold text-black sm:text-2xl">
            Explore Products
          </h2>
          <CustomTag
            text={`Showing ${total} items`}
            color="#EAEDFF"
            className="rounded-xl!"
          />
        </div>
        <div className="self-start sm:self-auto">
          <CustomTag
            text="Verified Seller"
            icon={<BsPatchCheck />}
            color="#EAEDFF"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-white p-3 lg:flex-row lg:items-center lg:justify-between font-sans">
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-xs font-semibold uppercase ">
            Active Filters :
          </p>
          {activeFilters.map((f) => (
            <FilterTag key={f.id} text={f.text} onClose={f.onRemove} />
          ))}
          {activeFilters.length > 0 && (
            <CustomButton
              type="link"
              text="Clear All"
              onClick={clearAll}
              className="text-xs! font-semibold!"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <Badge count={activeFilters.length} size="small" color="#4f46e5">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-violet-100 px-3 text-xs font-semibold text-slate-700 lg:hidden"
            >
              <MdFilterList className="text-base" />
              Filters
            </button>
          </Badge>

          <div className="flex items-center rounded-lg bg-violet-100 p-1 font-semibold">
            <div className="theme-muted flex items-center gap-1 pl-1 text-xs">
              <MdOutlineSort />
              <span>Sort:</span>
            </div>
            <Select
              value={filters.sortBy}
              variant="borderless"
              className="w-32! bg-violet-100! sm:w-40!"
              onChange={(value) => updateFilters({ sortBy: value })}
              options={[
                { value: "high-to-low", label: "High to Low" },
                { value: "low-to-high", label: "Low to High" },
              ]}
              suffixIcon={<></>}
            />
          </div>
        </div>
      </div>

      <div className="grid w-full gap-6 py-6 sm:py-8 lg:grid-cols-[18rem_1fr]">
        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <FilterSidebar filters={filters} onChange={updateFilters} />
        </div>

        <div className="min-w-0">
          {isLoading && (
            <p className="theme-muted py-16 text-center text-sm">
              Loading products...
            </p>
          )}

          {isError && (
            <p className="py-16 text-center text-sm text-red-600">
              Failed to load products. Please try again.
            </p>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  to={`/shop/${p._id}`}
                  image={p.image?.url}
                  name={p.name}
                  brand={p.seller?.storeName || p.sellerId?.name}
                  price={money(p.price)}
                  badge={getBadge(p)}
                  rating={5}
                  reviews={15}
                  sizes={p.sizes}
                />
              ))}
            </div>
          )}

          {!isLoading && !isError && products.length === 0 && (
            <p className="theme-muted py-16 text-center text-sm">
              No products found.
            </p>
          )}

          {total > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-center sm:mt-10">
              <Pagination
                current={filters.page}
                pageSize={PAGE_SIZE}
                total={total}
                showSizeChanger={false}
                showLessItems
                onChange={(page) => {
                  updateFilters({ page });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        size={320}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        styles={{ body: { padding: 12 } }}
      >
        <FilterSidebar filters={filters} onChange={updateFilters} />
      </Drawer>
    </div>
  );
}

export default ExplorePage;
