
import { Button, Card, Empty, Flex, Modal, Skeleton, Tag, Typography, notification } from "antd";
import { useGetMyOrders } from "../hooks/useGetMyOrders";
import { useCancelOrderItem } from "../hooks/useCancelOrderItem";
import Loader from "../../../shared/components/loader";

const { Title, Text } = Typography;


const statusColors = {
  pending: "gold",
  confirmed: "blue",
  processing: "cyan",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

const MyOrders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetMyOrders();
  const { mutate: cancelItem, isPending: isCancelling } = useCancelOrderItem();

  const handleCancel = (orderId, itemId) => {
    Modal.confirm({
      title: "Cancel this item?",
      content: "This action will cancel this item in your order.",
      okText: "Cancel item",
      okButtonProps: { danger: true, loading: isCancelling },
      cancelText: "Keep item",
      onOk: () =>
        new Promise((resolve, reject) => {
          cancelItem(
            { orderId, itemId },
            {
              onSuccess: () => {
                notification.success({ message: "Item cancelled successfully" });
                resolve();
              },
              onError: (error) => {
                notification.error({
                  message: "Unable to cancel item",
                  description:
                    error.response?.data?.message || "Please try again.",
                });
                reject();
              },
            },
          );
        }),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Loader/>
      </div>
    );
  }

  if (isError) {
    return (
      <Flex vertical align="center" gap={12} className="p-8">
        <Text>Unable to load your orders.</Text>
        <Button onClick={() => refetch()}>Try again</Button>
      </Flex>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <Title level={2}>My Orders</Title>

      {orders.length === 0 ? (
        <Empty description="You haven't placed any orders yet." />
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            title={
              <Flex vertical gap={4}>
                <Text strong>Order #{order._id}</Text>
                <Text type="secondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            }
            
          >
            <Flex vertical gap={16}>
              {order.items.map((item) => (
                <Flex
                  key={item._id}
                  gap={12}
                  align="center"
                  className="min-w-0"
                >

                  <img
                    src={item.productId?.image?.url}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded object-cover"
                  />

                  <Flex flex={1} vertical gap={4} className="min-w-0">
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">
                      Qty: {item.quantity}
                      {item.size ? ` · Size: ${item.size}` : ""}
                    </Text>

                    <Text>{item.itemTotal}</Text>
                  </Flex>
                 Status
                  {item.status === "pending" ? (
                    <Button
                      type="link"
                      danger
                      disabled={isCancelling}

                      onClick={() => handleCancel(order._id, item._id)}
                    >
                      Pending
                    </Button>
                  ) : (
                    <Tag color={statusColors[item.status] || "default"}>
                      {item.status}
                    </Tag>
                  )}
                </Flex>
              ))}

              <div className="border-t pt-3">
                <Flex justify="space-between">
                  <Text type="secondary">Payment</Text>
                  <Text>
                    {order.paymentMethod} · {order.paymentStatus}
                  </Text>
                </Flex>

                <Flex justify="space-between" className="mt-2">
                  <Text type="secondary">Subtotal</Text>
                  <Text>{order.subtotal}</Text>
                </Flex>

                <Flex justify="space-between" className="mt-1">
                  <Text type="secondary">Shipping</Text>
                  <Text>{order.shippingCost}</Text>
                </Flex>

                <Flex justify="space-between" className="mt-2">
                  <Text strong>Order total</Text>
                  <Text strong>{order.total}</Text>
                </Flex>
              </div>
            </Flex>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyOrders;
