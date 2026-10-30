import { Checkbox, Tag } from "antd";
import { formatPrice, getStockStatus } from "../utils/productUtils";

function SellerProductRow({
  product,
  isOpen,
  isSelected,
  isBulkDeleting,
  selectionLimitReached,
  onToggle,
  onSelectionChange,
  token,
}) {
  const stock = Number(product.stock) || 0;
  const stockStatus = getStockStatus(stock);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={`flex cursor-pointer items-center gap-3 border-b px-3 py-3 outline-none transition-colors last:border-b-0 md:gap-4 md:px-5 ${
        isOpen ? "" : "hover:bg-slate-500/10"
      }`}
      style={{
        borderColor: token.colorBorder,
        background: isOpen ? token.colorPrimaryBg : undefined,
        boxShadow: isOpen ? `inset 3px 0 0 0 ${token.colorPrimary}` : undefined,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Checkbox
          checked={isSelected}
          disabled={isBulkDeleting || (!isSelected && selectionLimitReached)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            onSelectionChange(product._id, event.target.checked)
          }
        />

        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-700 md:h-14 md:w-14">
          <img
            src={product.image?.url}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="line-clamp-1 text-[13px] font-bold capitalize text-slate-100 md:text-sm">
            {product.name}
          </span>

          <span className="line-clamp-1 text-[10px] text-slate-500 md:text-[11px]">
            {product.description}
          </span>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 md:hidden">
            <span className="text-[10px] text-slate-400">
              {product.category}
            </span>

            <span className="text-[11px] font-bold text-slate-200">
              {formatPrice(product.price)}
            </span>

            <Tag
              className={`m-0 rounded-md border-0 px-1.5 py-0 text-[9px] font-semibold ${stockStatus.className}`}
            >
              {stockStatus.label}: {stock}
            </Tag>
          </div>
        </div>
      </div>

      <span className="hidden w-32 truncate text-xs text-slate-400 md:block">
        {product.category}
      </span>

      <span className="hidden w-28 text-right text-[13px] font-bold text-slate-100 md:block">
        {formatPrice(product.price)}
      </span>

      <div className="hidden w-32 flex-col items-end gap-1 md:flex">
        <span className="text-sm font-bold text-slate-100">{stock}</span>
        <Tag
          className={`m-0 rounded-md border-0 px-2 py-0.5 text-[10px] font-bold ${stockStatus.className}`}
        >
          {stockStatus.label}
        </Tag>
      </div>
    </div>
  );
}

export default SellerProductRow;
