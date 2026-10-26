import { Flex, Table, Tag } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { money } from "../../../shared/utils/currency";

function RecentOrder({ orders = [], isLoading = false }) {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>#{text}</a>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {customer?.name ?? "-"}
          </span>
          <span className="text-xs text-gray-500">
            {customer?.email ?? "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => `${items?.length ?? 0} item(s)`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => (total == null ? "-" : money(total)),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => (
        <Flex gap="small" align="center" wrap>
          <Tag color={paymentStatus === "completed" ? "green" : "gold"}>
            {paymentStatus?.toUpperCase() ?? "UNKNOWN"}
          </Tag>
        </Flex>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: () => (
        <Tag>
          View <MdKeyboardArrowRight />
        </Tag>
      ),
    },
  ];

  const data = orders.map((order) => ({
    ...order,
    key: order._id,
    orderId: order._id,
    customer: order.customerId,
    total:
      order.totalPrice ?? order.totalAmount ?? order.total ?? order.grandTotal,
  }));

  return (
    <div className="rounded-xl bg-white p-4 sm:p-6">
      <p className="theme-muted text-xs">Live Transaction Feed</p>
      <h2 className="text-black text-lg mb-3 font-medium">Recent Orders</h2>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          size="large"
          scroll={{ x: 760 }}
          className="[&_.ant-table-thead>tr>th]:bg-violet-50! [&_.ant-table-thead>tr>th]:p-4! [&_.ant-table-thead>tr>th]:text-xs!"
          loading={isLoading}
          dataSource={data}
          locale={{ emptyText: "No recent orders found." }}
        />
      </div>
    </div>
  );
}

export default RecentOrder;
