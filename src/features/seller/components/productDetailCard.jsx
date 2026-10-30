import { useEffect, useRef } from "react";
import { Button, theme } from "antd";
import {
  MdEdit,
  MdDelete,
  MdInventory2,
  MdClose,
  MdSell,
  MdCategory,
  MdLayers,
} from "react-icons/md";
import { money } from "../../../shared/utils/currency";

const useStockState = (stock) => {
  const { token } = theme.useToken();

  if (stock > 10) return { label: "In stock", color: token.colorSuccess };
  if (stock > 0) return { label: "Low stock", color: token.colorWarning };

  return { label: "Out of stock", color: token.colorError };
};

function StatTile({ icon, label, children, className = "" }) {
  const { token } = theme.useToken();

  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-3 min-w-0 ${className}`}
      style={{
        background: token.colorFillQuaternary,
        border: `1px solid ${token.colorBorder}`,
      }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: token.colorPrimaryBg,
          color: token.colorPrimary,
        }}
        aria-hidden="true"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <div
          className="text-[11px] font-semibold"
          style={{ color: token.colorTextTertiary }}
        >
          {label}
        </div>

        <div
          className="mt-0.5 truncate text-sm font-bold md:text-base"
          style={{ color: token.colorText }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ProductDetailCard({
  product,
  onClose,
  onEdit,
  onUpdateStock,
  onDelete,
  scrollOnOpen = true,
}) {
  const { token } = theme.useToken();
  const ref = useRef(null);
  const productId = product?._id;
  const state = useStockState(product?.stock ?? 0);

  useEffect(() => {
    if (!productId || !scrollOnOpen) return;

    const id = requestAnimationFrame(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(id);
  }, [productId, scrollOnOpen]);

  if (!product) return null;

  return (
    <section
      ref={ref}
      aria-label={`Details for ${product.name}`}
      className="w-full min-w-0 overflow-hidden rounded-2xl scroll-mt-4"
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 md:px-5"
        style={{ borderBottom: `1px solid ${token.colorBorder}` }}
      >
        <span className="text-sm font-bold" style={{ color: token.colorText }}>
          Product details
        </span>

        <Button
          type="text"
          aria-label="Close product details"
          onClick={onClose}
          icon={<MdClose size={20} />}
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ color: token.colorTextSecondary }}
        />
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row md:gap-6 md:p-5">
        <div
          className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:w-48 md:w-60"
          style={{
            background: token.colorFillSecondary,
            border: `1px solid ${token.colorBorder}`,
          }}
        >
          {product.image?.url && (
            <img
              src={product.image.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2
              className="m-0 break-words text-lg font-bold capitalize md:text-xl"
              style={{ color: token.colorText }}
            >
              {product.name}
            </h2>

            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: state.color }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: state.color }}
              />
              {state.label}
            </span>

            <p
              className="m-0 mt-1 max-w-prose whitespace-pre-line break-words text-sm"
              style={{ color: token.colorTextSecondary }}
            >
              {product.description || "No description added."}
            </p>
          </div>

          <div className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 xl:grid-cols-3">
            <StatTile icon={<MdSell size={20} />} label="Price">
              {money(product.price)}
            </StatTile>

            <StatTile icon={<MdLayers size={20} />} label="In stock">
              {product.stock} {product.stock === 1 ? "unit" : "units"}
            </StatTile>

            <StatTile
              icon={<MdCategory size={20} />}
              label="Category"
              className="sm:col-span-2 xl:col-span-1"
            >
              {product.category || "—"}
            </StatTile>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-2 px-4 py-3 sm:flex sm:flex-wrap sm:justify-end md:gap-3 md:px-5 md:py-4"
        style={{
          borderTop: `1px solid ${token.colorBorder}`,
          background: token.colorFillQuaternary,
        }}
      >
        <Button
          type="primary"
          icon={<MdEdit size={18} />}
          onClick={() => onEdit?.(product)}
          className="col-span-2 h-10 rounded-xl px-5 text-sm font-semibold sm:col-span-1"
        >
          Edit product
        </Button>

        <Button
          icon={<MdInventory2 size={18} />}
          onClick={() => onUpdateStock?.(product)}
          className="h-10 rounded-xl px-5 text-sm font-semibold"
        >
          Update stock
        </Button>

        <Button
          danger
          icon={<MdDelete size={18} />}
          onClick={() => onDelete?.(product)}
          className="h-10 rounded-xl px-5 text-sm font-semibold"
        >
          Delete
        </Button>
      </div>
    </section>
  );
}

export default ProductDetailCard;
