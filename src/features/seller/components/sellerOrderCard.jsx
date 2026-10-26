import { Tag } from "antd";
import {
  GetOrderStatus,
  PAYMENT_STATUS,
  shortId,
} from "../../orders/constant/constant";
import { money } from "../../../shared/utils/currency";
import { liveTotal } from "../constants/productConstants";
import { formatDate } from "../../../shared/utils/formatDate";

function SellerOrderCard({ order, active, onSelect }) {
  const status = GetOrderStatus(order);
  const payment = PAYMENT_STATUS[order.paymentStatus];
  const first = order.items[0];
  const more = order.items.length - 1;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-2xl border-l-4 bg-white p-4 text-left shadow-sm ring-1 transition ${
        active
          ? "border-indigo-700 ring-indigo-200"
          : "border-transparent ring-slate-100 hover:ring-indigo-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 flex items-center gap-2 text-sm font-bold text-slate-900">
            {shortId(order)}
            <Tag color={status.color} className="m-0! text-[10px]!">
              {status.label}
            </Tag>
          </p>
          <p className="m-0 mt-1 text-[11px] text-slate-500">
            {order.customerId?.name} • {order.shippingAddress?.city}
          </p>
        </div>
        <div className="text-right">
          <p className="m-0 text-base font-bold text-slate-900">
            {money(liveTotal(order))}
          </p>
          <p
            className={`m-0 text-[10px] font-semibold ${payment?.color ?? "text-slate-500"}`}
          >
            {payment?.label ?? order.paymentStatus}
          </p>
        </div>
      </div>

      {first && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-indigo-50/60 p-2">
          <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {first.productId?.image?.url && (
              <img
                src={first.productId.image.url}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <p className="m-0 min-w-0 flex-1 truncate text-[11px] font-medium text-slate-800">
            {first.name}
          </p>
          {more > 0 && (
            <span className="shrink-0 text-[10px] font-semibold text-indigo-700">
              +{more} more
            </span>
          )}
        </div>
      )}

      <p className="m-0 mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>{formatDate(order.createdAt)}</span>
        <span className="font-semibold uppercase">{order.paymentMethod}</span>
      </p>
    </button>
  );
}

export default SellerOrderCard;
