import { useState } from "react";
import { Button, Input, Pagination, Select, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  MdCreditCard,
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlineReceiptLong,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import { money } from "../../../shared/utils/currency";
import { useNavigate } from "react-router-dom";
import { getAdminOrderSummary, getAdminOrders } from "../api/api";

const PAGE_SIZE = 10;

const PAYMENT_OPTIONS = [
  { value: "all", label: "Payment: All Types" },
  { value: "COD", label: "COD" },
  { value: "card", label: "Card" },
];

const columns = [
  {
    title: "ORDER ID",
    render: (_, o) => (
      <>
        <p className="m-0 text-xs font-bold text-indigo-700">#{o.id}</p>
        <p className="m-0 text-[10px] text-slate-500">{o.date}</p>
      </>
    ),
  },
  {
    title: "CUSTOMER",
    render: (_, o) => (
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {o.name[0]}
        </span>
        <div>
          <p className="m-0 text-xs font-semibold">{o.name}</p>
          <p className="m-0 text-[10px] text-slate-500">{o.email}</p>
        </div>
      </div>
    ),
  },
  { title: "SELLER STORE", dataIndex: "store" },
  {
    title: "ITEMS",
    render: (_, o) => `${o.items} ${o.items === 1 ? "item" : "items"}`,
  },
  {
    title: "TOTAL",
    dataIndex: "total",
    render: (t) => <b>{money(t)}</b>,
  },
  {
    title: "PAYMENT",
    render: (_, o) => (
      <span
        className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
          o.payment === "paid" || o.payment === "completed"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {`${o.payment ?? "Unknown"} (${o.method ?? "Unknown"})`}
      </span>
    ),
  },
  
];

function OrdersFulfillment() {
  const [keyword, setKeyword] = useState("");
  const [payment, setPayment] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const summaryQuery = useQuery({
    queryKey: ["admin", "orders", "summary"],
    queryFn: getAdminOrderSummary,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", { page, keyword, payment }],
    queryFn: () =>
      getAdminOrders({
        page,
        limit: PAGE_SIZE,
        search: keyword.trim(),
        ...(payment !== "all" ? { payment } : {}),
      }),
  });

  const filter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const reset = () => {
    setKeyword("");
    setPayment("all");
    setPage(1);
  };

  const summary = summaryQuery.data ?? {};
  const pagination = ordersQuery.data?.pagination ?? {};
  const rows = (ordersQuery.data?.orders ?? []).map((order) => ({
    ...order,
    id: order._id,
    date: new Date(order.createdAt).toLocaleString(),
    name: order.customerId?.name ?? "Unknown customer",
    email: order.customerId?.email ?? "-",
    store: order.items?.[0]?.sellerId ?? "-",
    items: order.items?.length ?? 0,
    total: order.total,
    payment: order.paymentStatus,
    method: order.paymentMethod,
  }));
  const from = rows.length ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
  const to = rows.length ? from + rows.length - 1 : 0;

  const stats = [
    {
      icon: MdOutlineReceiptLong,
      title: "All Orders",
      amount: summaryQuery.isLoading ? "..." : (summary.totalOrders ?? 0),
    },
    {
      icon: MdOutlineLocalShipping,
      title: "In Transit",
      amount: summaryQuery.isLoading ? "..." : (summary.inTransit ?? 0),
    },
    {
      icon: MdOutlineLocalShipping,
      title: "Delivered",
      amount: summaryQuery.isLoading ? "..." : (summary.deliveredOrders ?? 0),
    },
    {
      icon: MdOutlinePayments,
      title: "Last Month Subtotal",
      amount: summaryQuery.isLoading
        ? "..."
        : money(summary.lastMonthSubtotal ?? 0),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-4  ">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Orders &amp; Fulfillment Management
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-md text-xs">
        Track customer orders across all sellers, manage refunds, and inspect
        delivery statuses.
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

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input
            allowClear
            variant="filled"
            placeholder="Search order ID, customer, or email"
            value={keyword}
            onChange={(e) => filter(setKeyword)(e.target.value)}
            prefix={<MdSearch className="text-lg text-slate-500" />}
            className="lg:max-w-60"
          />
          <div className="flex items-center gap-3 lg:ml-auto">
            <Select
              variant="filled"
              value={payment}
              onChange={filter(setPayment)}
              options={PAYMENT_OPTIONS}
              suffixIcon={<MdCreditCard />}
              className="min-w-44 flex-1 lg:flex-none"
            />
            <Button
              type="text"
              aria-label="Reset filters"
              onClick={reset}
              icon={<MdRefresh className="text-lg" />}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Active Orders Listing
          </span>
          <span className="text-[10px] text-slate-500">
            Showing {from}-{to} of {pagination.total ?? 0}
          </span>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={ordersQuery.isLoading}
          onRow={(s) => ({
            className: "cursor-pointer",
            onClick: (e) => {
              if (e.target.closest(".ant-table-selection-column")) return;
              navigate(`${s.id}`);
            },
          })}
          pagination={false}
          scroll={{ x: 900 }}
          locale={{ emptyText: "No orders match your filters" }}
          className="[&_.ant-table-thead>tr>th]:bg-white!  [&_.ant-table-tbody>tr>td]:pl-4! [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:p-4!"
        />

        <div className="border-t border-slate-100 px-4 py-3">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={pagination.total ?? 0}
            showSizeChanger={false}
            showLessItems
            onChange={setPage}
            itemRender={(_, type, original) =>
              type === "prev" ? "Previous" : type === "next" ? "Next" : original
            }
          />
        </div>
      </div>
    </div>
  );
}

export default OrdersFulfillment;
