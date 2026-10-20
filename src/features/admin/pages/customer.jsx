import { useState } from "react";
import { App, Button, Form, Input, Modal, Select, Table, Tag } from "antd";
import {
  MdOutlineGroups,
  MdOutlineRepeat,
  MdOutlineTrendingUp,
  MdOutlineMonitorHeart,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import { money } from "../../../shared/utils/currency";
import { initials } from "../constant/constant";
import CustomerInspector from "../components/customerInspector";
import { PASSWORD_CHECKS } from "../../../shared/utils/constant";

const CUSTOMERS = [
  {
    id: "USR-9901",
    name: "Elena Vance",
    email: "elena.vance@auramarket.design",
    joined: "Jan 12, 2023",
    orders: 14,
    spent: 1450,
    lastOrder: "2 hours ago",
    lastOrderId: "AURA-89240",
    status: "active",
    tier: "vip",
    tierNote: "Tier: High Value",
    disputes: 0,
    isNew: false,
    address: ["142 Water Street, Loft 4B", "Brooklyn, NY 11201, United States"],
    recent: [
      {
        id: "AURA-89240",
        meta: "2 hours ago • 3 items",
        amount: 240,
        state: "Processing",
      },
      {
        id: "AURA-86419",
        meta: "Apr 24, 2024 • 1 item",
        amount: 590,
        state: "Delivered",
      },
      {
        id: "AURA-81092",
        meta: "Mar 10, 2024 • 1 item",
        amount: 620,
        state: "Delivered",
      },
    ],
    memo: "Customer requested expedited courier routing on high-ticket decor orders. VIP expedited delivery badge applied automatically.",
  },
  {
    id: "USR-9902",
    name: "Marcus Kane",
    email: "m.kane@nexuslogik.io",
    joined: "Aug 04, 2023",
    orders: 8,
    spent: 840,
    lastOrder: "Yesterday",
    lastOrderId: "AURA-89104",
    status: "flagged",
    tier: "high",
    tierNote: "Frequent Buyer",
    disputes: 1,
    isNew: false,
    address: ["88 Market Street", "San Francisco, CA 94103, United States"],
    recent: [],
    memo: "",
  },
  {
    id: "USR-9903",
    name: "Sara Lin",
    email: "sara.lin@creatives.co",
    joined: "Nov 12, 2023",
    orders: 5,
    spent: 610.5,
    lastOrder: "May 12",
    lastOrderId: "AURA-88401",
    status: "active",
    tier: "mid",
    tierNote: "Mid Tier",
    disputes: 0,
    isNew: true,
    address: ["12 Pine Avenue", "Seattle, WA 98101, United States"],
    recent: [],
    memo: "",
  },
  {
    id: "USR-9904",
    name: "Alexandre H.",
    email: "alex.h@rivegauche.fr",
    joined: "Feb 28, 2024",
    orders: 1,
    spent: 120,
    lastOrder: "May 10",
    lastOrderId: "AURA-82019",
    status: "suspended",
    tier: "regular",
    tierNote: "Chargeback Risk",
    disputes: 2,
    isNew: false,
    address: ["5 Rue de Rivoli", "Paris 75004, France"],
    recent: [],
    memo: "",
  },
  {
    id: "USR-9905",
    name: "Julian Wu",
    email: "julian.wu@atelierwu.com",
    joined: "Jan 30, 2024",
    orders: 3,
    spent: 360,
    lastOrder: "May 09",
    lastOrderId: "AURA-81988",
    status: "active",
    tier: "regular",
    tierNote: "Regular",
    disputes: 0,
    isNew: true,
    address: ["77 Queen Street", "Toronto, ON M5C 2B6, Canada"],
    recent: [],
    memo: "",
  },
];

const STATUS_TAG = {
  active: { label: "Active", color: "green" },
  flagged: { label: "Flagged", color: "orange" },
  suspended: { label: "Suspended", color: "red" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "Status: All Accounts" },
  { value: "active", label: "Active" },
  { value: "flagged", label: "Flagged" },
  { value: "suspended", label: "Suspended" },
];

const DEFAULTS = { keyword: "", status: "all", tier: "all", page: 1 };

const columns = [
  {
    title: "CUSTOMER",
    render: (_, c) => (
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {initials(c.name)}
        </span>
        <div className="min-w-0">
          <p className="m-0 flex items-center gap-1.5 text-xs font-bold text-slate-900">
            {c.name}
            {c.tier === "vip" && (
              <Tag
                color="#EAEDFF"
                className="m-0! text-[9px]! text-indigo-700!"
              >
                VIP
              </Tag>
            )}
          </p>
          <p className="m-0 truncate text-[10px] text-slate-500">{c.email}</p>
          <p className="m-0 text-[10px] text-slate-400">Joined {c.joined}</p>
        </div>
      </div>
    ),
  },
  {
    title: "ORDERS",
    dataIndex: "orders",
    render: (n) => `${n} ${n === 1 ? "order" : "orders"}`,
  },
  {
    title: "LIFETIME SPENT",
    render: (_, c) => (
      <>
        <b className="text-xs">{money(c.spent)}</b>
        <p
          className={`m-0 text-[10px] font-semibold ${c.tierNote === "Chargeback Risk" ? "text-red-600" : "text-indigo-700"}`}
        >
          {c.tierNote}
        </p>
      </>
    ),
  },
  {
    title: "LAST ORDER",
    render: (_, c) => (
      <>
        <p className="m-0 text-xs">{c.lastOrder}</p>
        <p className="m-0 font-mono text-[10px] text-slate-500">
          {c.lastOrderId}
        </p>
      </>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    render: (s) => (
      <Tag
        color={STATUS_TAG[s].color}
        bordered={false}
        className="text-[10px]!"
      >
        {STATUS_TAG[s].label}
      </Tag>
    ),
  },
];

function CustomerManagement() {
  const { notification } = App.useApp();
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [f, setF] = useState(DEFAULTS);
  const [inspectedId, setInspectedId] = useState(CUSTOMERS[0].id);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [form] = Form.useForm();

  const update = (patch) => setF((prev) => ({ ...prev, page: 1, ...patch }));
  const patchCustomer = (id, patch) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );

  const q = f.keyword.trim().toLowerCase();
  const filtered = customers.filter(
    (c) =>
      (!q ||
        [c.name, c.email, c.id].some((v) => v.toLowerCase().includes(q))) &&
      (f.status === "all" || c.status === f.status) &&
      (f.tier === "all" || c.tier === f.tier),
  );

  const inspected = customers.find((c) => c.id === inspectedId) ?? null;
  const repeat = customers.filter((c) => c.orders > 1).length;

  const stats = [
    {
      icon: MdOutlineGroups,
      title: "Total Customers",
      amount: customers.length.toLocaleString(),
    },
    {
      icon: MdOutlineMonitorHeart,
      title: "Active (Last 30 Days)",
      amount: customers.filter((c) => c.status === "active").length,
    },
    {
      icon: MdOutlineRepeat,
      title: "Repeat Buyers",
      amount: `${customers.length ? ((repeat / customers.length) * 100).toFixed(1) : 0}%`,
    },
    {
      icon: MdOutlineTrendingUp,
      title: "New This Week",
      amount: `+${customers.filter((c) => c.isNew).length}`,
    },
  ];

  const handleDeactivate = () => {
    patchCustomer(inspected.id, { status: "suspended" });
    notification.success({
      title: "Account deactivated",
      description: inspected.name,
      placement: "bottomRight",
    });
  };

  const handleSavePassword = async () => {
    const values = await form.validateFields();

    console.log("Password validated:", values.password);
    setPasswordOpen(false);
    form.resetFields();
  };

  const handleMessage = () => window.open(`mailto:${inspected.email}`);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 ">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Customer &amp; User Management
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-xl text-xs">
        View customer profiles, purchase history, saved addresses, and manage
        account statuses across all global storefronts.
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

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_22rem] ">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 xl:flex-row xl:items-center">
            <Input
              allowClear
              variant="filled"
              placeholder="Search by Name, Email, or Customer ID"
              value={f.keyword}
              onChange={(e) => update({ keyword: e.target.value })}
              prefix={<MdSearch className="text-lg text-slate-500" />}
              className="xl:max-w-64"
            />
            <Select
              variant="filled"
              value={f.status}
              onChange={(status) => update({ status })}
              options={STATUS_OPTIONS}
              className="xl:w-44"
            />

            <Button
              type="text"
              aria-label="Reset filters"
              className="xl:ml-auto"
              icon={<MdRefresh className="text-lg" />}
              onClick={() => setF(DEFAULTS)}
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              scroll={{ x: 640 }}
              onRow={(c) => ({
                className: `cursor-pointer ${c.id === inspectedId ? "row-active" : ""}`,
                onClick: () => setInspectedId(c.id),
              })}
              locale={{ emptyText: "No customers match your filters" }}
              pagination={{
                current: f.page,
                pageSize: 10,
                showSizeChanger: false,
                showLessItems: true,
                onChange: (page) => setF((prev) => ({ ...prev, page })),
                showTotal: (total, [from, to]) =>
                  `Showing ${from} - ${to} of ${total.toLocaleString()} `,
                itemRender: (_, type, original) =>
                  type === "prev"
                    ? "Previous"
                    : type === "next"
                      ? "Next"
                      : original,
              }}
              className="[&_.ant-table-thead>tr>th]:bg-white! [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:p-4! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-tbody>tr.row-active>td]:bg-indigo-50! [&_.ant-pagination]:px-4! [&_.ant-table-tbody>tr>td]:pl-4!"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <CustomerInspector
            customer={inspected}
            onClose={() => setInspectedId(null)}
            onDeactivate={handleDeactivate}
            onMessage={handleMessage}
            onNote={() => setPasswordOpen(true)}
          />
        </div>
      </div>

      <Modal
        title="Change user password"
        open={passwordOpen}
        okText="Save Password"
        onOk={handleSavePassword}
        onCancel={() => setPasswordOpen(false)}
      >
        <Form layout="vertical" className="theme-form" form={form}>
          <Form.Item
            label="Password"
            name="password"
            required={false}
            className="theme-form-label mt-3! font-semibold"
            rules={[
              { required: true, message: "Password is required" },
              { max: 128, message: "Password must be less than 128 character" },
              {
                validator: (_, value) =>
                  !value || PASSWORD_CHECKS.every((c) => c.test(value))
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Password doesn't meet all requirements"),
                      ),
              },
            ]}
          >
            <Input.Password size="large" className="font-normal" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            required={false}
            dependencies={["password"]}
            className="theme-form-label font-semibold"
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The password not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" className="font-normal" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerManagement;
