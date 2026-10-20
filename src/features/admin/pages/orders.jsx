import { useState } from "react";
import { Button, Input, Pagination, Select, Table } from "antd";
import {
  MdCreditCard,
  MdErrorOutline,
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlineReceiptLong,
  MdOutlineReplay,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import { money } from "../../../shared/utils/currency";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const ORDERS = [
  {
    id: "ORD-89421",
    date: "Today, 10:42 AM",
    name: "Elena Vance",
    email: "elena.vance@auram.io",
    store: "Studio Kanso",
    items: 1,
    total: 279.8,
    payment: "paid",
    method: "Stripe",
    fulfillment: "in-transit",
    tracking: "DHL #864102",
  },
  {
    id: "ORD-89420",
    date: "Today, 09:15 AM",
    name: "Marcus Kane",
    email: "m.kane@nexus.io",
    store: "Echizen Craft",
    items: 1,
    total: 340,
    payment: "paid",
    method: "ApplePay",
    fulfillment: "preparing",
  },
  {
    id: "ORD-89419",
    date: "Yesterday, 19:30",
    name: "Sara Lin",
    email: "sara@designcraft.org",
    store: "Forma Atelier",
    items: 3,
    total: 512.5,
    payment: "paid",
    method: "Stripe",
    fulfillment: "delivered",
    tracking: "FedEx #81523",
  },
  {
    id: "ORD-89418",
    date: "Yesterday, 14:02",
    name: "Alexandra H.",
    email: "alex.h@luxegoods.fr",
    store: "Studio Kanso",
    items: 1,
    total: 120,
    payment: "refund",
    method: "Refund",
    fulfillment: "return-pending",
  },
  {
    id: "ORD-89417",
    date: "May 12, 11:10",
    name: "Julian Wu",
    email: "jwu@cdldd.com",
    store: "Nordic Lines",
    items: 4,
    total: 890,
    payment: "paid",
    method: "PayPal",
    fulfillment: "delivered",
  },
];

const FULFILLMENT = {
  "in-transit": { label: "In Transit", color: "bg-indigo-50 text-indigo-700" },
  preparing: { label: "Preparing", color: "bg-amber-50 text-amber-700" },
  shipped: { label: "Shipped", color: "bg-sky-50 text-sky-700" },
  delivered: { label: "Delivered", color: "bg-emerald-50 text-emerald-700" },
  "return-pending": {
    label: "Return Pending",
    color: "bg-red-50 text-red-600",
  },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-600" },
};

const STATUS_CHIPS = [
  { value: "all", label: "All", test: () => true },
  { value: "paid", label: "Paid", test: (o) => o.payment === "paid" },
  {
    value: "preparing",
    label: "Preparing",
    test: (o) => o.fulfillment === "preparing",
  },
  {
    value: "shipped",
    label: "Shipped",
    test: (o) => o.fulfillment === "shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
    test: (o) => o.fulfillment === "delivered",
  },
  {
    value: "problem",
    label: "Disputed / Cancelled",
    test: (o) => ["return-pending", "cancelled"].includes(o.fulfillment),
  },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "Payment: All Types" },
  { value: "stripe", label: "Stripe" },
  { value: "cod", label: "COD" },
];

const RANGE_OPTIONS = [
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
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
          o.payment === "paid"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {o.payment === "paid" ? `Paid (${o.method})` : "Refund Req."}
      </span>
    ),
  },
  {
    title: "FULFILLMENT",
    render: (_, o) => (
      <>
        <span
          className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase ${FULFILLMENT[o.fulfillment].color}`}
        >
          {FULFILLMENT[o.fulfillment].label}
        </span>
        {o.tracking && (
          <p className="m-0 mt-1 text-[10px] text-slate-500">{o.tracking}</p>
        )}
      </>
    ),
  },
];

function OrdersFulfillment() {
  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState(30);
  const [payment, setPayment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const reset = () => {
    setKeyword("");
    setRange(30);
    setPayment("all");
    setStatus("all");
    setPage(1);
  };

  const q = keyword.trim().toLowerCase().replace("#", "");
  const activeChip = STATUS_CHIPS.find((c) => c.value === status);

  const filtered = ORDERS.filter(
    (o) =>
      (!q ||
        o.id.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)) &&
      (payment === "all" || o.method === payment) &&
      activeChip.test(o),
  );

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  const count = (fn) => ORDERS.filter(fn).length;
  const payouts = ORDERS.filter((o) => o.payment === "paid").reduce(
    (sum, o) => sum + o.total,
    0,
  );

  const stats = [
    { icon: MdOutlineReceiptLong, title: "All Orders", amount: ORDERS.length },
    {
      icon: MdErrorOutline,
      title: "Unfulfilled >48h",
      amount: count((o) => o.fulfillment === "preparing"),
    },
    {
      icon: MdOutlineLocalShipping,
      title: "In Transit",
      amount: count((o) => o.fulfillment === "in-transit"),
    },
    {
      icon: MdOutlineReplay,
      title: "Refund Requests",
      amount: count((o) => o.payment === "refund"),
    },
    {
      icon: MdOutlinePayments,
      title: "Monthly Payouts",
      amount: money(payouts),
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          <Select
            variant="filled"
            value={range}
            onChange={setRange}
            options={RANGE_OPTIONS}
            className="lg:w-40"
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Status:
          </span>
          {STATUS_CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => filter(setStatus)(c.value)}
              className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                status === c.value
                  ? "bg-indigo-700 text-white"
                  : c.value === "problem"
                    ? "bg-red-50 text-red-600"
                    : "bg-indigo-50 text-slate-700"
              }`}
            >
              {c.label} ({count(c.test)})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Active Orders Listing
          </span>
          <span className="text-[10px] text-slate-500">
            Showing {from}-{to} of {filtered.length}
          </span>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
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
            total={filtered.length}
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
