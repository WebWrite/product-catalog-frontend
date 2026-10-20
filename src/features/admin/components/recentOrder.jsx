import { Flex, Table, Tag } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";

function RecentOrder() {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{customer.name}</span>
          <span className="text-xs text-gray-500">{customer.email}</span>
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
    },
    {
      title: "Items",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <Flex gap="small" align="center" wrap>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "refund") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
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

  const data = [
    {
      key: "1",
      orderId: "#ORD-1001",
      customer: {
        name: "Ali Khan",
        email: "ali.khan@example.com",
      },
      store: "Nike Store",
      item: "Air Max 270",
      total: "$150.00",
      tags: ["completed"],
    },
    {
      key: "2",
      orderId: "#ORD-1002",
      customer: {
        name: "Sarah Ahmed",
        email: "sarah.ahmed@example.com",
      },
      store: "Apple Store",
      item: "iPhone 16",
      total: "$899.00",
      tags: ["pending"],
    },
    {
      key: "3",
      orderId: "#ORD-1003",
      customer: {
        name: "Usman Malik",
        email: "usman.malik@example.com",
      },
      store: "Adidas Store",
      item: "Ultraboost Shoes",
      total: "$180.00",
      tags: ["shipped"],
    },
    {
      key: "4",
      orderId: "#ORD-1004",
      customer: {
        name: "Ayesha Noor",
        email: "ayesha.noor@example.com",
      },
      store: "Samsung Store",
      item: "Galaxy Buds",
      total: "$120.00",
      tags: ["refund"],
    },
    {
      key: "5",
      orderId: "#ORD-1005",
      customer: {
        name: "Hamza Ali",
        email: "hamza.ali@example.com",
      },
      store: "Puma Store",
      item: "Running Jacket",
      total: "$85.00",
      tags: ["completed"],
    },
    {
      key: "6",
      orderId: "#ORD-1006",
      customer: {
        name: "Fatima Sheikh",
        email: "fatima.sheikh@example.com",
      },
      store: "Apple Store",
      item: "AirPods Pro",
      total: "$249.00",
      tags: ["pending"],
    },
    {
      key: "7",
      orderId: "#ORD-1007",
      customer: {
        name: "Ahmed Raza",
        email: "ahmed.raza@example.com",
      },
      store: "Nike Store",
      item: "Running Shoes",
      total: "$135.00",
      tags: ["shipped"],
    },
    {
      key: "8",
      orderId: "#ORD-1008",
      customer: {
        name: "Zara Hussain",
        email: "zara.hussain@example.com",
      },
      store: "Samsung Store",
      item: "Galaxy S25",
      total: "$799.00",
      tags: ["completed"],
    },
  ];
  return (
    <div className="rounded-xl bg-white p-6">
      <p className="theme-muted text-xs ">Live Transcation Feed</p>
      <h2 className="text-black text-lg mb-3 font-medium">Recent Orders</h2>
      <Table
        columns={columns}
        size="large"
        className="[&_.ant-table-thead>tr>th]:bg-violet-50! [&_.ant-table-thead>tr>th]:p-4! [&_.ant-table-thead>tr>th]:text-xs! "
        dataSource={data}
      />
    </div>
  );
}

export default RecentOrder;
