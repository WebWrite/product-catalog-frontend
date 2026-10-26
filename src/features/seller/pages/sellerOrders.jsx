import { Button, notification } from "antd";
import { CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import {
  useSellerOrders,
  useUpdateOrderStatus,
} from "../hooks/useSellerProducts";
import OrdersList from "../../../shared/components/ordersList";
import confirmCancelItem from "../../../shared/components/confirmCancelItem";

const SellerOrders = () => {
  const { data: orders = [], isPending, isError, refetch } = useSellerOrders();

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const handleStatusChange = (orderId, itemId, status) => {
    updateStatus(
      { orderId, itemId, status },
      {
        onSuccess: () => {
          notification.success({
            message: "Item status updated successfully",
          });
        },
        onError: (error) => {
          notification.error({
            message: "Unable to update item status",
            description: error.response?.data?.message || "Please try again.",
          });
        },
      },
    );
  };

  const handleCancel = (orderId, itemId) =>
    confirmCancelItem((callbacks) =>
      updateStatus({ orderId, itemId, status: "cancelled" }, callbacks),
    );

  const renderItemActions = (order, item) => {
    const canDeliver =
      (order.paymentMethod === "COD" && item.status === "pending") ||
      (order.paymentMethod === "STRIPE" && item.status === "confirmed");

    const canCancel = item.status === "pending";

    if (!canDeliver && !canCancel) return null;

    return (
      <>
        {canDeliver && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={isUpdating}
            onClick={() => handleStatusChange(order._id, item._id, "delivered")}
          >
            Mark delivered
          </Button>
        )}

        {canCancel && (
          <Button
            danger
            icon={<CloseOutlined />}
            loading={isUpdating}
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
      title="Seller Orders"
      subtitle="Update the status of items in orders placed with your workshop"
      emptyText="No orders for your products yet."
      errorText="Unable to load seller orders."
      orders={orders}
      isLoading={isPending}
      isError={isError}
      onRetry={refetch}
      HeaderIcon={UserOutlined}
      renderItemActions={renderItemActions}
    />
  );
};

export default SellerOrders;
