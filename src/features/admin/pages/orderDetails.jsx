import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Tag, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdOutlineInventory2 } from "react-icons/md";
import ItemRow from "../components/orderItem";
import Ledger from "../components/ledger";
import Recipient from "../components/orderRecipient";
import { getAdminOrderById, updateAdminOrderItemStatus } from "../api/api";

function normalizeOrder(order) {
  if (!order) return null;

  return {
    ...order,
    id: order._id,
    customer: {
      ...order.customerId,
      phone: order.shippingAddress?.phone ?? "-",
      ltv: "-",
    },
    items: (order.items ?? []).map((item) => ({
      ...item,
      id: item._id,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      seller: item.sellerId?.name ?? "Unknown seller",
      location: "",
      qty: item.quantity,
      unitPrice: item.price,
      image: item.productId?.image?.url ?? "",
      variant: item.size,
    })),
    shipping: {
      address: [
        order.shippingAddress?.fullName,
        order.shippingAddress?.address,
        [order.shippingAddress?.city, order.shippingAddress?.postalCode]
          .filter(Boolean)
          .join(", "),
      ].filter(Boolean),
      instructions: `Phone: ${order.shippingAddress?.phone ?? "-"}`,
    },
  };
}

function OrderDetail() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const orderQuery = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getAdminOrderById(orderId),
    enabled: !!orderId,
  });
  const statusMutation = useMutation({
    mutationFn: updateAdminOrderItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      message.success("Item status updated.");
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message ?? "Unable to update item status.",
      );
    },
  });

  const order = useMemo(
    () => normalizeOrder(orderQuery.data),
    [orderQuery.data],
  );

  if (orderQuery.isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading order...</div>;
  }

  if (orderQuery.isError || !order) {
    return (
      <div className="p-6 text-sm text-red-600">Unable to load this order.</div>
    );
  }

  const changeStatus = (itemId, status) => {
    statusMutation.mutate({ orderId, itemId, status });
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <h1 className="m-0 mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        Order #{order.id}
      </h1>
      <p className="m-0 mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        Placed {new Date(order.createdAt).toLocaleString()} • Customer:
        <span className="font-semibold text-slate-900">
          {order.customer.name}
        </span>
        <Tag color="#EAEDFF" className="m-0! text-[10px]! text-indigo-700!">
          {order.paymentMethod}
        </Tag>
      </p>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="m-0 flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <MdOutlineInventory2 />
            </span>
            Order Items
          </h2>
          <Tag className="m-0! hidden text-[9px]! uppercase sm:inline-block">
            Fulfillment sync: real-time
          </Tag>
        </div>

        {order.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onStatus={changeStatus}
            isUpdating={
              statusMutation.isPending &&
              statusMutation.variables?.itemId === item.id
            }
          />
        ))}
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Ledger
          items={order.items}
          subtotal={order.subtotal}
          shippingCost={order.shippingCost}
          total={order.total}
        />
        <Recipient
          customer={order.customer}
          shipping={order.shipping}
          payment={order.paymentMethod}
        />
      </div>
    </div>
  );
}

export default OrderDetail;
