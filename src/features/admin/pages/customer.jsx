import { useState } from "react";
import { App, Button, Form, Input, Modal, Select, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MdOutlineGroups,
  MdOutlineMonitorHeart,
  MdOutlineRepeat,
  MdOutlineTrendingUp,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import CustomerInspector from "../components/customerInspector";
import { money } from "../../../shared/utils/currency";
import { initials } from "../constant/constant";
import { PASSWORD_CHECKS } from "../../../shared/utils/constant";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import {
  getAdminCustomerOrders,
  getAdminCustomers,
  getAdminCustomerSummary,
  updateAdminCustomer,
} from "../api/api";

const PAGE_SIZE = 10;
const STATUS_TAG = {
  active: { label: "Active", color: "green" },
  blocked: { label: "Blocked", color: "orange" },
  suspended: { label: "Suspended", color: "red" },
};
const STATUS_OPTIONS = [
  { value: "all", label: "Status: All Accounts" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "suspended", label: "Suspended" },
];

function normalizeCustomer(customer, orders = []) {
  const firstOrder = orders[0];
  const address = firstOrder?.shippingAddress;
  return {
    ...customer,
    id: customer._id,
    joined: customer.createdAt
      ? new Date(customer.createdAt).toLocaleDateString()
      : "-",
    orders: customer.totalOrders ?? orders.length,
    spent: customer.lifetimeSpent ?? 0,
    tier: (customer.lifetimeSpent ?? 0) >= 50000 ? "vip" : "regular",
    tierNote: (customer.lifetimeSpent ?? 0) >= 50000 ? "High Value" : "Regular",
    disputes: 0,
    address: address
      ? [
          address.address,
          [address.city, address.postalCode].filter(Boolean).join(", "),
        ].filter(Boolean)
      : [],
    recent: orders.slice(0, 3).map((order) => ({
      id: order._id,
      meta: `${new Date(order.createdAt).toLocaleDateString()} • ${order.items?.length ?? 0} items`,
      amount: order.total,
      state: order.paymentStatus,
    })),
    memo: "",
  };
}

function CustomerManagement() {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
  });
  const [inspectedId, setInspectedId] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [form] = Form.useForm();
  const debouncedSearch = useDebounce(filters.search);

  const summaryQuery = useQuery({
    queryKey: ["admin", "customers", "summary"],
    queryFn: getAdminCustomerSummary,
  });
  const customersQuery = useQuery({
    queryKey: ["admin", "customers", { ...filters, search: debouncedSearch }],
    queryFn: () =>
      getAdminCustomers({
        page: filters.page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim(),
        ...(filters.status !== "all" ? { status: filters.status } : {}),
      }),
  });
  const selectedCustomer = (customersQuery.data?.customers ?? []).find(
    (customer) => customer._id === inspectedId,
  );
  const ordersQuery = useQuery({
    queryKey: ["admin", "customer", inspectedId, "orders"],
    queryFn: () => getAdminCustomerOrders(inspectedId),
    enabled: !!inspectedId,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAdminCustomer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "customers", "summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "customer", inspectedId],
      });
      notification.success({
        title: "Customer updated",
        description: "Customer account was updated successfully.",
        placement: "bottomRight",
      });
    },
    onError: () =>
      notification.error({
        title: "Update failed",
        description: "Unable to update this customer.",
        placement: "bottomRight",
      }),
  });

  const customer = selectedCustomer
    ? normalizeCustomer(selectedCustomer, ordersQuery.data ?? [])
    : null;
  const summary = summaryQuery.data ?? {};
  const data = customersQuery.data ?? {};
  const pagination = data.pagination ?? {};
  const customers = data.customers ?? [];
  const updateFilters = (patch) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }));

  const columns = [
    {
      title: "CUSTOMER",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {initials(item.name)}
          </span>
          <div>
            <p className="m-0 text-xs font-bold text-slate-900">{item.name}</p>
            <p className="m-0 text-[10px] text-slate-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "ORDERS",
      dataIndex: "totalOrders",
      render: (value) => `${value ?? 0} orders`,
    },
    {
      title: "LIFETIME SPENT",
      dataIndex: "lifetimeSpent",
      render: (value) => money(value ?? 0),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={STATUS_TAG[status]?.color ?? "default"}>
          {STATUS_TAG[status]?.label ?? status}
        </Tag>
      ),
    },
  ];

  const stats = [
    {
      icon: MdOutlineGroups,
      title: "Total Customers",
      amount: summary.totalCustomers ?? 0,
    },
    {
      icon: MdOutlineMonitorHeart,
      title: "Active Customers",
      amount: summary.activeCustomers ?? 0,
    },
    {
      icon: MdOutlineRepeat,
      title: "Repeat Buyers",
      amount: summary.repeatBuyers ?? 0,
    },
    {
      icon: MdOutlineTrendingUp,
      title: "Total Spend",
      amount: money(summary.totalSpend ?? 0),
    },
  ];

  const updateCustomer = (payload) =>
    updateMutation.mutate({ id: inspectedId, payload });

  const handleSavePassword = async () => {
    const values = await form.validateFields();
    updateMutation.mutate(
      { id: inspectedId, payload: { password: values.password } },
      {
        onSuccess: () => {
          setPasswordOpen(false);
          form.resetFields();
        },
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Customer &amp; User Management
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-xl text-xs">
        View customer profiles, purchase history, and manage account statuses.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AnalyticalCard
            key={stat.title}
            icon={<stat.icon className="size-4" />}
            title={stat.title}
            amount={summaryQuery.isLoading ? "..." : stat.amount}
          />
        ))}
      </div>

      <div className="mt-4 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row">
            <Input
              allowClear
              variant="filled"
              placeholder="Search by name or email"
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              prefix={<MdSearch className="text-lg text-slate-500" />}
              className="min-w-0 flex-1"
            />
            <Select
              variant="filled"
              value={filters.status}
              onChange={(status) => updateFilters({ status })}
              options={STATUS_OPTIONS}
              className="w-full sm:w-44"
            />
            <Button
              type="text"
              icon={<MdRefresh />}
              onClick={() => setFilters({ search: "", status: "all", page: 1 })}
            />
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <div className="overflow-x-auto">
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={customers}
                loading={customersQuery.isLoading}
                scroll={{ x: 600 }}
                className="[&_.ant-table-thead>tr>th]:bg-white! [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-tbody>tr.row-active>td]:bg-indigo-50! [&_.ant-table-tbody>tr.row-flagged>td]:bg-red-50/60! [&_.ant-table-thead>tr>th]:p-4!"
                onRow={(item) => ({
                  className: `cursor-pointer ${item._id === inspectedId ? "row-active" : ""}`,
                  onClick: () => setInspectedId(item._id),
                })}
                pagination={{
                  current: pagination.page ?? filters.page,
                  pageSize: pagination.limit ?? PAGE_SIZE,
                  total: pagination.totalCustomers ?? 0,
                  showSizeChanger: false,
                  onChange: (page) =>
                    setFilters((current) => ({ ...current, page })),
                }}
                locale={{ emptyText: "No customers match your filters" }}
              />
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-24">
          <CustomerInspector
            customer={customer}
            onClose={() => setInspectedId(null)}
            onDeactivate={() => updateCustomer({ status: "suspended" })}
            onMessage={() => window.open(`mailto:${customer?.email}`)}
            onNote={() => setPasswordOpen(true)}
          />
        </div>
      </div>

      <Modal
        title="Change user password"
        open={passwordOpen}
        okText="Save Password"
        confirmLoading={updateMutation.isPending}
        onOk={handleSavePassword}
        onCancel={() => setPasswordOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { max: 128, message: "Password must be less than 128 character" },
              {
                validator: (_, value) =>
                  !value || PASSWORD_CHECKS.every((check) => check.test(value))
                    ? Promise.resolve()
                    : Promise.reject(new Error("Password is too weak")),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || value === getFieldValue("password")
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerManagement;
