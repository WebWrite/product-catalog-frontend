import { Tag } from "antd";
import { MdClose, MdOpenInNew, MdStar, MdVerified } from "react-icons/md";
import { money } from "../../../shared/utils/currency";

function ProductView({ product, onClose }) {
  if (!product) {
    return (
      <aside className="rounded-2xl bg-white p-6 text-center text-xs text-slate-500 shadow-sm ring-1 ring-slate-100">
        Select a product row to inspect its details.
      </aside>
    );
  }

  const commission = (product.price * product.commissionRate) / 100;
  const payout = product.price - commission;

  return (
    <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <p className="m-0 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          Active Inspector
        </p>
        <div className="flex items-center gap-2 text-base text-slate-500">
          <MdOpenInNew />
          <button
            type="button"
            aria-label="Close inspector"
            onClick={onClose}
            className="flex cursor-pointer items-center hover:text-slate-800"
          >
            <MdClose />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {product.image && (
            <img
              src={product.image}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <Tag color="#EAEDFF" className="m-0! text-[10px]! text-slate-700!">
              {product.category}
            </Tag>
            <span className="font-mono text-[10px] text-indigo-700">
              SKU: {product.sku}
            </span>
          </p>
          <h3 className="m-0 mt-1 text-base font-bold leading-snug text-slate-900">
            {product.name}
          </h3>
          <p className="m-0 mt-1 flex items-center gap-1 text-[11px] text-slate-600">
            By <span className="font-semibold">{product.seller}</span>
            <MdVerified className="text-indigo-600" />
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-indigo-100 ring-1 ring-indigo-100">
        <div className="bg-white p-3">
          <p className="m-0 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Listing Price
          </p>
          <p className="m-0 mt-1 text-lg font-bold text-slate-900">
            {money(product.price)}
          </p>
          <p className="m-0 text-[10px] text-slate-500">Tier: {product.tier}</p>
        </div>
        <div className="bg-white p-3">
          <p className="m-0 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Stock Available
          </p>
          <p className="m-0 mt-1 text-lg font-bold text-slate-900">
            {product.stock} units
          </p>
          <p
            className={`m-0 text-[10px] font-semibold ${
              product.stock === 0 ? "text-red-600" : "text-indigo-700"
            }`}
          >
            {product.velocity}
          </p>
        </div>
        <div className="bg-white p-3">
          <p className="m-0 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Commission ({product.commissionRate}%)
          </p>
          <p className="m-0 mt-1 text-lg font-bold text-indigo-700">
            {money(commission)}
          </p>
          <p className="m-0 text-[10px] text-slate-500">Fee / transaction</p>
        </div>
        <div className="bg-white p-3">
          <p className="m-0 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Seller Payout
          </p>
          <p className="m-0 mt-1 text-lg font-bold text-slate-900">
            {money(payout)}
          </p>
          <p className="m-0 text-[10px] text-slate-500">Automated Escrow</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50 px-3 py-2.5 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <MdStar className="text-sm text-amber-600" />
          <span className="font-bold text-slate-900">{product.rating}</span>(
          {product.reviews} verified customer reviews)
        </span>
        <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-700">
          Return Rate: {product.returnRate}%
        </span>
      </div>
    </aside>
  );
}

export default ProductView;
