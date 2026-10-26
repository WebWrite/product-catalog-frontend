import { useRef, useState } from "react";
import { App, Button, Empty, Result, Skeleton } from "antd";
import { useGetMyOrders } from "../hooks/useGetMyOrders";
import { useCancelOrderItem } from "../hooks/useCancelOrderItem";
import { useRetryStripePayment } from "../hooks/useRetryStripePayment";
import confirmCancelItem from "../../../shared/components/confirmCancelItem";
import OrderCard from "../../../shared/components/orderCard";
import OrderDetail from "../../../shared/components/ordersList";

const MyOrders = () => {
  const { notification } = App.useApp();
  const detailRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const { data: orders = [], isLoading, isError, refetch } = useGetMyOrders();
  const { mutate: cancelItem, isPending: isCancelling } = useCancelOrderItem();
  const { mutate: retryPayment, isPending: isRetrying } =
    useRetryStripePayment();

  const selected = orders.find((o) => o._id === selectedId) ?? orders[0];

  const handleSelect = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCancel = (orderId, itemId) =>
    confirmCancelItem((callbacks) =>
      cancelItem({ orderId, itemId }, callbacks),
    );

  const handleRetryPayment = (orderId) =>
    retryPayment(orderId, {
      onError: (error) =>
        notification.error({
          title: "Unable to retry payment",
          description: error.response?.data?.message || "Please try again.",
          placement: "bottomRight",
        }),
    });

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl  p-4 ">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        My Orders
      </h1>
      <p className="theme-muted m-0 mt-2 text-xs">
        Track the status of every item you ordered
      </p>

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
          description="You haven't placed any orders yet."
        />
      )}

      {!isLoading && !isError && selected && (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
          <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                active={order._id === selected._id}
                onSelect={() => handleSelect(order._id)}
              />
            ))}
          </div>

          <div ref={detailRef} className="min-w-0 scroll-mt-24">
            <OrderDetail
              order={selected}
              onCancel={handleCancel}
              onRetry={handleRetryPayment}
              isCancelling={isCancelling}
              isRetrying={isRetrying}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
