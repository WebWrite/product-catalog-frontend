import {Button,Card,Empty,Flex,Select,Tag,Typography,notification,} from "antd";
import Loader from "../../../shared/components/loader";
import {
  useSellerOrders,
  useUpdateOrderStatus,
} from "../hooks/useSellerProducts";

const { Title, Text } = Typography;

const editableStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors = {
  pending: "gold",
  confirmed: "blue",
  processing: "cyan",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

const finalStatuses = ["delivered", "cancelled"];

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SellerOrders() {
  const {
    data: orders = [],
    isPending,
    isError,
    refetch,
  } = useSellerOrders();

  const {mutate: updateStatus,isPending: isUpdating,} = useUpdateOrderStatus();

  const handleStatusChange = (orderId, itemId, status) => {
    updateStatus(
      { orderId, itemId, status },
      {
        onSuccess: () =>
          notification.success({
            message: "Item status updated successfully",
          }),
        onError: (error) =>
          notification.error({
            message: "Unable to update item status",
            description:
              error.response?.data?.message || "Please try again.",
          }),
      },
    );
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <Flex vertical align="center" gap={12} className="p-8">
        <Text>Unable to load seller orders.</Text>
        <Button onClick={() => refetch()}>Try again</Button>
      </Flex>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <Title level={2}>Seller Orders</Title>

      {orders.length === 0 ? (
        <Empty description="No orders for your products yet." />
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            title={<Text strong>Order #{order._id}</Text>}
          >
            <Flex vertical gap={16}>
              {order.items.map((item) => {
                const isFinal = finalStatuses.includes(item.status);

                return (
                  <Flex
                    key={item._id}
                    align="center"
                    gap={12}
                    className="min-w-0"
                    wrap="wrap"
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

                      <Text>{formatPrice(item.itemTotal)}</Text>
                    </Flex>

                    {isFinal ? (
                      <Tag color={statusColors[item.status] || "default"}>
                        {item.status}
                      </Tag>
                    ) : (
                      <Select
                        value={item.status}
                        loading={isUpdating}
                        disabled={isUpdating}
                        style={{ width: 140 }}
                        options={editableStatuses.map((status) => ({
                          label:
                            status.charAt(0).toUpperCase() + status.slice(1),
                          value: status,
                        }))}
                        onChange={(status) =>
                          handleStatusChange(order._id, item._id, status)
                        }
                      />
                    )}
                  </Flex>
                );
              })}

              <div className="border-t pt-3">
                <Flex justify="space-between">
                  <Text type="secondary">Payment method</Text>
                  <Text>{order.paymentMethod}</Text>
                </Flex>

                <Flex justify="space-between" className="mt-2">
                  <Text type="secondary">Payment status</Text>
                  <Text>{order.paymentStatus}</Text>
                </Flex>
              </div>
            </Flex>
          </Card>
        ))
      )}
    </div>
  );
}
