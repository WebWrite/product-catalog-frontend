import { Link } from "react-router-dom";
import {
  MdAdd,
  MdDeleteOutline,
  MdRemove,
  MdStorefront,
  MdVerified,
} from "react-icons/md";
import { money } from "../utils/currency";

function CartItem({
  id,
  to,
  image,
  name,
  variant,
  inStock = true,
  note,
  unitPrice,
  quantity,
  maxQuantity = 25,
  onQuantityChange,
  onRemove,
  sellerName,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="m-2 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5">
        <MdStorefront className="text-lg text-indigo-700" />
        <span className="text-sm font-semibold text-slate-900">
          {sellerName}
        </span>
        <MdVerified className="text-base text-indigo-600" />
      </div>

      <div className="divide-y divide-slate-100">
        <div className="flex gap-4 px-4 py-4 sm:gap-5 sm:px-5">
          <Link
            to={to}
            className="block size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-36"
          >
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link to={to}>
                  <h3 className="m-0 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                    {name}
                  </h3>
                </Link>
                {variant && (
                  <p className="m-0 mt-1 text-[10px] text-slate-500 sm:text-sm">
                    {variant}
                  </p>
                )}
                <p className="m-0 mt-1.5 flex items-center gap-2 text-[11px] text-slate-600 sm:text-xs">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      inStock ? "bg-indigo-700" : "bg-red-500"
                    }`}
                  />
                  {inStock ? "In Stock" : "Out of Stock"}
                  {note && <span>• {note}</span>}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="m-0 text-lg font-bold text-slate-900 sm:text-xl">
                  {money(unitPrice * quantity)}
                </p>
                {quantity > 1 && (
                  <p className="m-0 text-[11px] text-slate-500 sm:text-xs">
                    {money(unitPrice)} each
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
              <div className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 p-1 ring-1 ring-indigo-100">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => onQuantityChange(id, -1)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-base text-slate-700 shadow-sm transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdRemove />
                </button>
                <span className="w-9 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQuantity}
                  onClick={() => onQuantityChange(id, 1)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-base text-slate-700 shadow-sm transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdAdd />
                </button>
              </div>

              <div className="flex items-center gap-5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  className="flex cursor-pointer items-center gap-1.5 text-red-600 transition-colors hover:text-red-700"
                >
                  <MdDeleteOutline className="text-base" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
