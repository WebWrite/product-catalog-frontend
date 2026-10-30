import { Empty, Skeleton } from "antd";
import SellerProductRow from "./sellerProductRow";

function SellerProductsList({
  products,
  isLoading,
  isError,
  selectedProductIds,
  isBulkDeleting,
  detailId,
  onToggleDetail,
  onSelectionChange,
  token,
}) {
  return (
    <div
      className="max-h-[500px] w-full min-w-0 overflow-y-auto rounded-2xl border"
      style={{
        background: "var(--workspace-surface)",
        borderColor: token.colorBorder,
      }}
    >
      <div
        className="hidden items-center gap-4 border-b px-5 py-3 md:flex"
        style={{ borderColor: token.colorBorder }}
      >
        <span className="flex-1 text-[11px] font-bold tracking-wider text-slate-500">
          PRODUCT
        </span>
        <span className="w-32 text-[11px] font-bold tracking-wider text-slate-500">
          CATEGORY
        </span>
        <span className="w-28 text-right text-[11px] font-bold tracking-wider text-slate-500">
          PRICE (PKR)
        </span>
        <span className="w-32 text-right text-[11px] font-bold tracking-wider text-slate-500">
          STOCK
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 1 }} />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="p-8 text-center text-sm text-slate-500">
          Failed to load products.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="p-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-sm text-slate-500">No products found</span>
            }
          />
        </div>
      )}

      {!isLoading &&
        !isError &&
        products.map((product) => (
          <SellerProductRow
            key={product._id}
            product={product}
            isOpen={product._id === detailId}
            isSelected={selectedProductIds.includes(product._id)}
            isBulkDeleting={isBulkDeleting}
            selectionLimitReached={selectedProductIds.length >= 100}
            onToggle={() => onToggleDetail(product)}
            onSelectionChange={onSelectionChange}
            token={token}
          />
        ))}
    </div>
  );
}

export default SellerProductsList;
