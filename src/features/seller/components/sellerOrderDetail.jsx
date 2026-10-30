import { Button, Steps, Tag, Tooltip } from "antd";
import {
  MdClose,
  MdOutlineCreditCard,
  MdOutlineInventory2,
  MdOutlineLocalShipping,
  MdOutlineMessage,
  MdOutlinePersonOutline,
  MdOutlinePlace,
  MdOutlineReceiptLong,
} from "react-icons/md";
import {
  getOrderStage,
  getSellerNextStatus,
  GetOrderStatus,
  canCancelOrderItem,
  PAYMENT_STATUS,
  shortId,
  statusTag,
  STEPS,
} from "../../orders/constant/constant";
import { formatDate } from "../../../shared/utils/formatDate";
import { liveTotal } from "../constants/productConstants";
import { money } from "../../../shared/utils/currency";
import { useSelector } from "react-redux";
import { useStartChat } from "../../chat/hooks/useChat";
import { useNavigate } from "react-router-dom";

function Card({ title, icon, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
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

function SellerOrderDetail({ order, onUpdate, onCancel, isUpdating }) {
  const status = GetOrderStatus(order);
  const stage = getOrderStage(order);
  const payment = PAYMENT_STATUS[order.paymentStatus];
  const address = order.shippingAddress;
  const customer = order.customerId;

  const blocked =
    order.paymentMethod?.toUpperCase() === "STRIPE" &&
    order.paymentStatus?.toLowerCase() !== "completed";
  const blockedReason = "Waiting for the customer's Stripe payment";

  const bulkItems = order.items.filter((item) =>
    getSellerNextStatus(order.paymentMethod, item.status, order.paymentStatus),
  );
  const bulk = bulkItems.length
    ? getSellerNextStatus(
        order.paymentMethod,
        bulkItems[0].status,
        order.paymentStatus,
      )
    : null;

  const advanceAll = () =>
    bulkItems.forEach((item) => onUpdate(order._id, item._id, bulk.to));
  const user = useSelector((state) => state.user);
  const startChat = useStartChat();
  const navigate = useNavigate();

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
            Placed {formatDate(order.createdAt)} • {order.paymentMethod}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-50 px-4 py-2 text-right">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Your Items Total
          </p>
          <p className="m-0 text-xl font-bold text-indigo-700">
            {money(liveTotal(order))}
          </p>
        </div>
      </section>

      <Card title="Fulfillment Progress" icon={<MdOutlineReceiptLong />}>
        {stage === -1 ? (
          <p className="m-0 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
            All items in this order were cancelled.
          </p>
        ) : (
          <>
            <Steps
              size="small"
              current={stage}
              status={stage === STEPS.length - 1 ? "finish" : "process"}
              items={STEPS.map((title) => ({ title }))}
            />
            {bulk && (
              <Tooltip title={blocked ? blockedReason : ""}>
                <span className="mt-4 block">
                  <Button
                    type="primary"
                    block
                    icon={<MdOutlineLocalShipping />}
                    disabled={blocked}
                    loading={isUpdating}
                    onClick={advanceAll}
                    className="bg-indigo-700!"
                  >
                    {bulk.label} — all {bulkItems.length}{" "}
                    {bulkItems.length === 1 ? "item" : "items"}
                  </Button>
                </span>
              </Tooltip>
            )}
          </>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Customer" icon={<MdOutlinePersonOutline />}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
              {(customer?.name ?? "?")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="m-0 text-sm font-bold text-slate-900">
                {customer?.name}
              </p>
              <p className="m-0 truncate text-[11px] text-slate-600">
                {customer?.email}
              </p>
              {address?.phone && (
                <p className="m-0 text-[11px] text-slate-600">
                  {address.phone}
                </p>
              )}
            </div>
          </div>
          <Button
            type="primary"
            icon={<MdOutlineMessage />}
            loading={startChat.isPending}
            onClick={() =>
              user
                ? startChat.mutate({
                    participantId: customer._id,
                  })
                : navigate("/auth/login")
            }
            className="bg-indigo-700! mt-3 w-full"
          >
            Send Direct Message
          </Button>{" "}
        </Card>

        <Card title="Ship To" icon={<MdOutlinePlace />}>
          <div className="rounded-xl bg-indigo-50/60 p-3 text-xs text-slate-700">
            <p className="m-0 font-bold text-slate-900">{address?.fullName}</p>
            <p className="m-0 mt-1">{address?.address}</p>
            <p className="m-0">
              {address?.city}
              {address?.postalCode && `, ${address.postalCode}`}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Payment" icon={<MdOutlineCreditCard />}>
        <div className="flex flex-col gap-2.5">
          <Row label="Method" value={order.paymentMethod} />
          <Row
            label="Status"
            value={payment?.label ?? order.paymentStatus}
            valueClass={payment?.color ?? "text-slate-900"}
          />
        </div>
        {blocked && (
          <p className="m-0 mt-3 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-700">
            {blockedReason}. You can ship once it shows as Paid.
          </p>
        )}
        {order.paymentMethod === "COD" && (
          <p className="m-0 mt-3 rounded-xl bg-indigo-50 p-3 text-[11px] text-slate-600">
            Cash on delivery: the customer pays the courier when the order
            arrives.
          </p>
        )}
      </Card>

      <Card
        title={`Items to fulfill (${order.items.length})`}
        icon={<MdOutlineInventory2 />}
      >
        <div className="flex flex-col gap-3">
          {order.items.map((item) => {
            const tag = statusTag(item.status);
            const next = getSellerNextStatus(
              order.paymentMethod,
              item.status,
              order.paymentStatus,
            );
            const canCancel = canCancelOrderItem(item.status);

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
                  <p className="m-0 mt-1 text-[11px] text-slate-600">
                    Qty: {item.quantity} × {money(item.price)}
                  </p>
                  <p className="m-0 mt-1 text-sm font-bold text-slate-900">
                    {money(item.itemTotal)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <Tag color={tag.color} className="m-0! text-[10px]!">
                    {tag.label}
                  </Tag>
                  <div className="flex gap-2">
                    {next && (
                      <Tooltip title={blocked ? blockedReason : ""}>
                        <span>
                          <Button
                            size="small"
                            type="primary"
                            disabled={blocked}
                            loading={isUpdating}
                            onClick={() =>
                              onUpdate(order._id, item._id, next.to)
                            }
                            className="bg-indigo-700!"
                          >
                            {next.label}
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {canCancel && (
                      <Button
                        danger
                        size="small"
                        icon={<MdClose />}
                        loading={isUpdating}
                        onClick={() => onCancel(order._id, item._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Order Summary" icon={<MdOutlineReceiptLong />}>
        <div className="flex flex-col gap-2.5">
          <Row
            label="Your items (excluding cancelled)"
            value={money(liveTotal(order))}
          />
          <Row label="Order subtotal" value={money(order.subtotal)} />
          <Row label="Shipping charged" value={money(order.shippingCost)} />
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-bold text-slate-900">Order total</span>
          <span className="text-2xl font-bold text-indigo-700">
            {money(order.total)}
          </span>
        </div>
      </Card>
    </div>
  );
}

export default SellerOrderDetail;
