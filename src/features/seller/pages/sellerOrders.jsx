import { useRef, useState } from "react";
import { App, Button, Empty, Input, Result, Segmented, Skeleton } from "antd";
import {
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlinePendingActions,
  MdOutlineReceiptLong,
  MdSearch,
} from "react-icons/md";

import {
  useSellerOrders,
  useUpdateOrderStatus,
} from "../hooks/useSellerProducts";
import AnalyticalCard from "../../admin/components/analyticalCard";
import confirmCancelItem from "../../../shared/components/confirmCancelItem";
import SellerOrderCard from "../components/sellerOrderCard";
import SellerOrderDetail from "../components/sellerOrderDetail";
import { FLOW, getOrderStage } from "../../orders/constant/constant";
import { liveTotal } from "../constants/productConstants";
import { money } from "../../../shared/utils/currency";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const matchesFilter = (order, filter) => {
  if (filter === "all") return true;
  const stage = getOrderStage(order);
  return filter === "cancelled" ? stage === -1 : FLOW[stage] === filter;
};

const SellerOrders = () => {
  const { notification } = App.useApp();
  const detailRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  const { data: orders = [], isLoading, isError, refetch } = useSellerOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const q = keyword.trim().toLowerCase().replace("#", "");
  const visible = orders.filter(
    (o) =>
      matchesFilter(o, filter) &&
      (!q ||
        [o._id, o.customerId?.name, o.customerId?.email].some((v) =>
          v?.toLowerCase().includes(q),
        )),
  );

  const selected = visible.find((o) => o._id === selectedId) ?? visible[0];

  const allItems = orders.flatMap((o) => o.items);
  const countItems = (status) =>
    allItems.filter((i) => i.status === status).length;
  const revenue = orders.reduce((sum, o) => sum + liveTotal(o), 0);

  const stats = [
    {
      icon: MdOutlineReceiptLong,
      title: "Total Orders",
      amount: orders.length,
    },
    {
      icon: MdOutlinePendingActions,
      title: "To Process",
      amount: countItems("pending"),
    },
    {
      icon: MdOutlineLocalShipping,
      title: "In Transit",
      amount: countItems("shipped"),
    },
    { icon: MdOutlinePayments, title: "Sales Value", amount: money(revenue) },
  ];

  const handleSelect = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleUpdate = (orderId, itemId, status) =>
    updateStatus(
      { orderId, itemId, status },
      {
        onSuccess: () =>
          notification.success({
            title: "Item updated",
            description: `Marked as ${status}`,
            placement: "bottomRight",
          }),
        onError: (error) =>
          notification.error({
            title: "Unable to update item",
            description: error.response?.data?.message || "Please try again.",
            placement: "bottomRight",
          }),
      },
    );

  const handleCancel = (orderId, itemId) =>
    confirmCancelItem((callbacks) =>
      updateStatus({ orderId, itemId, status: "cancelled" }, callbacks),
    );

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl  p-4 ">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Orders &amp; Fulfillment
      </h1>
      <p className="theme-muted m-0 mt-2 text-xs">
        Process, ship and track every order that contains your products
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <AnalyticalCard
            key={s.title}
            icon={<s.icon className="size-4" />}
            title={s.title}
            amount={s.amount}
          />
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <Skeleton active paragraph={{ rows: 8 }} />
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      )}

      {isError && (
        <Result
          status="error"
          title="Unable to load your orders."
          extra={
            <Button type="primary" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <Empty
          className="py-20"
          description="No orders for your products yet."
        />
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
          <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
            <Input
              allowClear
              variant="filled"
              placeholder="Search order ID, customer, email"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              prefix={<MdSearch className="text-lg text-slate-500" />}
            />
            <div className="overflow-x-auto">
              <Segmented
                size="small"
                value={filter}
                onChange={setFilter}
                options={FILTERS}
              />
            </div>

            {visible.length === 0 && (
              <Empty description="No orders match your filters" />
            )}

            {visible.map((order) => (
              <SellerOrderCard
                key={order._id}
                order={order}
                active={order._id === selected?._id}
                onSelect={() => handleSelect(order._id)}
              />
            ))}
          </div>

          <div ref={detailRef} className="min-w-0 scroll-mt-24">
            {selected && (
              <SellerOrderDetail
                order={selected}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                isUpdating={isUpdating}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
