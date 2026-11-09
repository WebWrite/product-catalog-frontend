import { Tag } from "antd";
import { formatDate } from "../utils/formatDate";
import { money } from "../utils/currency";
import {
  GetOrderStatus,
  PAYMENT_STATUS,
  shortId,
} from "../../features/orders/constant/constant";

function OrderCard({ order, active, onSelect }) {
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
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 flex min-w-0 items-center gap-2 text-sm font-bold text-slate-900">
            {shortId(order)}
            {/* <Tag color={status.color} className="m-0! text-[10px]!">
              {status.label}
            </Tag> */}
          </p>
          <p className="m-0 mt-1 truncate text-[11px] text-slate-500" title={`${order.shippingAddress?.fullName ?? ""} • ${order.shippingAddress?.city ?? ""}`}>
            {order.shippingAddress?.fullName} • {order.shippingAddress?.city}
          </p>
        </div>
        <div className="min-w-0 max-w-[42%] shrink-0 text-right">
          <p className="m-0 truncate text-base font-bold text-slate-900" title={money(order.total)}>
            {money(order.total)}
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

export default OrderCard;
