import { Button, Steps, Tag } from "antd";
import { money } from "../utils/currency";
import {
  getOrderStage,
  GetOrderStatus,
  PAYMENT_STATUS,
  sellerName,
  shortId,
  statusTag,
  STEPS,
} from "../../features/orders/constant/constant";
import {
  MdClose,
  MdOutlineCreditCard,
  MdOutlineInventory2,
  MdOutlinePlace,
  MdOutlineReceiptLong,
  MdOutlineStorefront,
  MdRefresh,
} from "react-icons/md";

import { formatDate } from "../utils/formatDate";

function Card({ title, icon, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 ${className}`}
    >
      <h2 className="m-0 flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="text-base text-indigo-700">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-slate-600">{label}</span>
      <span className={`text-right font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function OrderDetail({ order, onCancel, onRetry, isCancelling, isRetrying }) {
  const status = GetOrderStatus(order);
  const stage = getOrderStage(order);
  const payment = PAYMENT_STATUS[order.paymentStatus];
  const address = order.shippingAddress;

  const hasPendingItem = order.items.some((i) => i.status === "pending");
  const canRetry =
    order.paymentMethod === "STRIPE" &&
    ["pending", "failed"].includes(order.paymentStatus) &&
    hasPendingItem;

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div>
          <h1 className="m-0 flex flex-wrap items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
            Order {shortId(order)}
            <Tag color={status.color} className="m-0!">
              {status.label}
            </Tag>
          </h1>
          <p className="m-0 mt-2 text-xs text-slate-600">
            Placed {formatDate(order.createdAt)} • Paid via{" "}
            {order.paymentMethod}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-50 px-4 py-2 text-right">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Order Total
          </p>
          <p className="m-0 text-xl font-bold text-indigo-700">
            {money(order.total)}
          </p>
        </div>
      </section>

      <Card title="Order Progress" icon={<MdOutlineReceiptLong />}>
        {stage === -1 ? (
          <p className="m-0 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
            All items in this order were cancelled.
          </p>
        ) : (
          <Steps
            size="small"
            current={stage}
            status={stage === STEPS.length - 1 ? "finish" : "process"}
            items={STEPS.map((title) => ({ title }))}
          />
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Delivery Details" icon={<MdOutlinePlace />}>
          <div className="rounded-xl bg-indigo-50/60 p-3 text-xs text-slate-700">
            <p className="m-0 font-bold text-slate-900">{address?.fullName}</p>
            <p className="m-0 mt-1">{address?.address}</p>
            <p className="m-0">
              {address?.city}
              {address?.postalCode && `, ${address.postalCode}`}
            </p>
            {address?.phone && (
              <p className="m-0 mt-2 text-slate-500">{address.phone}</p>
            )}
          </div>
        </Card>

        <Card title="Payment" icon={<MdOutlineCreditCard />}>
          <div className="flex flex-col gap-2.5">
            <Row label="Method" value={order.paymentMethod} />
            <Row
              label="Status"
              value={payment?.label ?? order.paymentStatus}
              valueClass={payment?.color ?? "text-slate-900"}
            />
          </div>
          {canRetry && (
            <Button
              type="primary"
              block
              icon={<MdRefresh />}
              loading={isRetrying}
              onClick={() => onRetry(order._id)}
              className="mt-4 bg-indigo-700!"
            >
              Retry payment
            </Button>
          )}
        </Card>
      </div>

      <Card
        title={`Items in this order (${order.items.length})`}
        icon={<MdOutlineInventory2 />}
      >
        <div className="flex flex-col gap-3">
          {order.items.map((item) => {
            const tag = statusTag(item.status);
            return (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-xl bg-indigo-50/60 p-3 sm:flex-row sm:items-center"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.productId?.image?.url && (
                    <img
                      src={item.productId.image.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                    {item.name}
                    {item.size && (
                      <Tag
                        color="#EAEDFF"
                        className="m-0! text-[10px]! text-slate-700!"
                      >
                        Size {item.size}
                      </Tag>
                    )}
                  </p>
                  {sellerName(item) && (
                    <p className="m-0 mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                      <MdOutlineStorefront className="text-indigo-700" />
                      {sellerName(item)}
                    </p>
                  )}
                  <p className="m-0 mt-1 text-[11px] text-slate-600">
                    Qty: {item.quantity} × {money(item.price)}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <p className="m-0 text-sm font-bold text-slate-900">
                    {money(item.itemTotal)}
                  </p>
                  <Tag color={tag.color} className="m-0! text-[10px]!">
                    {tag.label}
                  </Tag>
                  {item.status === "pending" && (
                    <Button
                      danger
                      size="small"
                      icon={<MdClose />}
                      loading={isCancelling}
                      onClick={() => onCancel(order._id, item._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Order Summary" icon={<MdOutlineReceiptLong />}>
        <div className="flex flex-col gap-2.5">
          <Row label="Items subtotal" value={money(order.subtotal)} />
          <Row label="Shipping" value={money(order.shippingCost)} />
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-indigo-700">
            {money(order.total)}
          </span>
        </div>
      </Card>
    </div>
  );
}

export default OrderDetail;
