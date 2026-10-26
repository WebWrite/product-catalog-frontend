import { Button, notification } from "antd";
import { CloseOutlined, ReloadOutlined, ShopOutlined } from "@ant-design/icons";
import { useGetMyOrders } from "../hooks/useGetMyOrders";
import { useCancelOrderItem } from "../hooks/useCancelOrderItem";
import { useRetryStripePayment } from "../hooks/useRetryStripePayment";
import confirmCancelItem from "../../../shared/components/confirmCancelItem";
import OrdersList from "../../../shared/components/ordersList";

const MyOrders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetMyOrders();

  const { mutate: cancelItem, isPending: isCancelling } = useCancelOrderItem();

  const { mutate: retryPayment, isPending: isRetrying } =
    useRetryStripePayment();

  const handleCancel = (orderId, itemId) =>
    confirmCancelItem((callbacks) =>
      cancelItem({ orderId, itemId }, callbacks),
    );

  const handleRetryPayment = (orderId) => {
    retryPayment(orderId, {
      onError: (error) => {
        notification.error({
          message: "Unable to retry payment",
          description: error.response?.data?.message || "Please try again.",
        });
      },
    });
  };

  const renderItemActions = (order, item) => {
    const canCancel = item.status === "pending";

    const canRetry =
      order.paymentMethod === "STRIPE" &&
      ["pending", "failed"].includes(order.paymentStatus) &&
      item.status === "pending";

    if (!canRetry && !canCancel) return null;

    return (
      <>
        {canRetry && (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={isRetrying}
            onClick={() => handleRetryPayment(order._id)}
          >
            Retry payment
          </Button>
        )}

        {canCancel && (
          <Button
            danger
            icon={<CloseOutlined />}
            loading={isCancelling}
            onClick={() => handleCancel(order._id, item._id)}
          >
            Cancel
          </Button>
        )}
      </>
    );
  };

  return (
    <OrdersList
      title="My Orders"
      subtitle="Track the status of every item you ordered"
      emptyText="You haven't placed any orders yet."
      errorText="Unable to load your orders."
      orders={orders}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      HeaderIcon={ShopOutlined}
      renderItemActions={renderItemActions}
      darkCardBg="#1a2036"
    />
  );
};

export default MyOrders;
