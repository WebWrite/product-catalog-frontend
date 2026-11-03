import { useCallback, useRef, useState } from "react";
import { App, Button, Empty, Grid, Pagination, Result, Skeleton } from "antd";
import {
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlinePendingActions,
  MdOutlineReceiptLong,
} from "react-icons/md";

import {
  useSellerOrders,
  useSellerOrderStats,
  useUpdateOrderStatus,
} from "../hooks/useSellerProducts";
import AnalyticalCard from "../../admin/components/analyticalCard";
import confirmCancelItem from "../../../shared/components/confirmCancelItem";
import SellerOrderDetail from "../components/sellerOrderDetail";
import { money } from "../../../shared/utils/currency";
import OrderCard from "../../../shared/components/orderCard";
import SellerOrderFilters from "../components/sellerOrderFilters";

const SellerOrders = () => {
  const { notification } = App.useApp();
  const detailRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
    paymentStatus: "",
  });

  const handleFilterChange = useCallback((changes) => {
    setFilters((prev) => ({ ...prev, ...changes }));
    setPage(1);
    setSelectedId(null);
  }, []);

  const { data, isLoading, isError, refetch } = useSellerOrders({
    page,
    limit: 10,
    ...filters,
  });
  const {
    data: orderStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSellerOrderStats();

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;
  const screens = Grid.useBreakpoint();

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const selected =
    orders.find((order) => order._id === selectedId) ?? orders[0];

  const stats = [
    {
      icon: MdOutlineReceiptLong,
      title: "Total Orders",
      amount: isStatsLoading ? "..." : (orderStats?.totalOrders ?? 0),
    },
    {
      icon: MdOutlinePendingActions,
      title: "Items Under Process",
      amount: isStatsLoading ? "..." : (orderStats?.processingItems ?? 0),
    },
    {
      icon: MdOutlineLocalShipping,
      title: "Item Delivered",
      amount: isStatsLoading ? "..." : (orderStats?.deliveredItems ?? 0),
    },
    {
      icon: MdOutlinePayments,
      title: "Sales Value",
      amount: isStatsLoading ? "..." : money(orderStats?.totalSales ?? 0),
    },
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
    <div className="mx-auto min-h-screen w-full max-w-7xl p-4 sm:p-8  ">
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
            amount={isStatsError ? "Unavailable" : s.amount}
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

      {!isLoading && !isError && (
        <>
          <div className="mt-6">
            <SellerOrderFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>

          {orders.length === 0 ? (
            <Empty
              className="py-20"
              description={
                filters.search || filters.paymentMethod || filters.paymentStatus
                  ? "No orders match your filters."
                  : "No orders for your products yet."
              }
            />
          ) : (
            <>
              <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
                <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(190vh-8rem)] lg:overflow-y-auto lg:pr-1">
                  {orders.map((order) => (
                    <OrderCard
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

              {pagination?.total > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    size={screens.md ? "default" : "small"}
                    current={page}
                    pageSize={pagination.limit}
                    total={pagination.total}
                    showSizeChanger={false}
                    showLessItems
                    responsive
                    onChange={(nextPage) => {
                      setPage(nextPage);
                      setSelectedId(null);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SellerOrders;
