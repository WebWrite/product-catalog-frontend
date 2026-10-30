import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  MdOutlinePayments,
  MdOutlineStorefront,
  MdRefresh,
  MdSearch,
  MdVerified,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import { money } from "../../../shared/utils/currency";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { getAdminSellerSummary, getAdminSellers } from "../api/api";
import { LuMessageSquareText } from "react-icons/lu";
import { useStartChat } from "../../chat/hooks/useChat";
import { useSelector } from "react-redux";

const PAGE_SIZE = 10;
const CATEGORY_OPTIONS = [
  "Clothing",
  "Electronics",
  "Beauty",
  "Furniture",
  "Sports",
  "Toys",
  "Food",
];
const STATUS_OPTIONS = [
  { value: "all", label: "Status: All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function SellerManagement() {
  const startChat = useStartChat();
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    page: 1,
  });
  const debouncedSearch = useDebounce(filters.search);
  const summaryQuery = useQuery({
    queryKey: ["admin", "sellers", "summary"],
    queryFn: getAdminSellerSummary,
  });
  const sellersQuery = useQuery({
    queryKey: ["admin", "sellers", { ...filters, search: debouncedSearch }],
    queryFn: () =>
      getAdminSellers({
        page: filters.page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim(),
        status: filters.status,
        ...(filters.category !== "all" ? { category: filters.category } : {}),
      }),
  });

  const updateFilters = (patch) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  const data = sellersQuery.data ?? {};
  const summary = summaryQuery.data ?? {};
  const sellers = data.sellers ?? [];
  const pagination = data.pagination ?? {};

  const stats = [
    {
      icon: MdOutlineStorefront,
      title: "Total Sellers",
      amount: summary.totalSellers ?? 0,
    },
    {
      icon: MdVerified,
      title: "Active Stores",
      amount: summary.activeSellers ?? 0,
    },
    {
      icon: MdOutlinePayments,
      title: "Seller GMV",
      amount: money(summary.gmv ?? 0),
    },
  ];
  const columns = [
    {
      title: "STORE & BRAND",
      render: (_, seller) => (
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
            {seller.storeName?.[0] ?? "S"}
          </span>
          <div>
            <p className="m-0 flex items-center gap-1 text-xs font-bold text-slate-900">
              {seller.storeName}
              <MdVerified className="text-indigo-600" />
            </p>
            <p className="m-0 font-mono text-[10px] text-slate-500">
              {seller.storeType}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "OWNER / CONTACT",
      render: (_, seller) => (
        <>
          <p className="m-0 text-xs font-semibold text-slate-900">
            {seller.name}
          </p>
          <p className="m-0 text-[10px] text-slate-500">{seller.email}</p>
        </>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "PRODUCTS",
      dataIndex: "productCount",
      render: (count) => `${count ?? 0} items`,
    },
    {
      title: "MONTHLY GMV",
      dataIndex: "monthlySales",
      render: (sales, seller) => (
        <>
          <b className="text-xs">{money(sales ?? 0)}</b>
          <p className="m-0 text-[10px] text-slate-500">
            {seller.monthlyOrders ?? 0} orders
          </p>
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "end",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          loading={startChat.isPending}
          onClick={() =>
            user
              ? startChat.mutate({ admin: true, participantId: record.userId })
              : navigate("/auth/login")
          }
        >
          <LuMessageSquareText size={18} />
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-8 ">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Seller Management &amp; Approvals
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-lg text-xs">
        Manage onboarded merchant stores and track seller performance.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <AnalyticalCard
            key={stat.title}
            icon={<stat.icon className="size-4" />}
            title={stat.title}
            amount={summaryQuery.isLoading ? "..." : stat.amount}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center">
        <Input
          allowClear
          variant="filled"
          placeholder="Search store, owner, email"
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          prefix={<MdSearch className="text-lg text-slate-500" />}
          className="lg:max-w-60"
        />
        <Select
          variant="filled"
          value={filters.status}
          onChange={(status) => updateFilters({ status })}
          options={STATUS_OPTIONS}
          className="lg:w-44"
        />
        <Select
          variant="filled"
          value={filters.category}
          onChange={(category) => updateFilters({ category })}
          options={[
            { value: "all", label: "All Categories" },
            ...CATEGORY_OPTIONS.map((category) => ({
              value: category,
              label: category,
            })),
          ]}
          className="lg:w-52"
        />
        <Button
          type="text"
          aria-label="Reset filters"
          className="lg:ml-auto"
          icon={<MdRefresh className="text-lg" />}
          onClick={() =>
            setFilters({ search: "", status: "all", category: "all", page: 1 })
          }
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={sellers}
          loading={sellersQuery.isLoading}
          scroll={{ x: 1000 }}
          onRow={(seller) => ({
            className: "cursor-pointer",
            onClick: () => navigate(`/admin/sellers/${seller._id}`),
          })}
          locale={{ emptyText: "No sellers match your filters" }}
          pagination={{
            current: pagination.page ?? filters.page,
            pageSize: pagination.limit ?? PAGE_SIZE,
            total: pagination.totalSellers ?? 0,
            showSizeChanger: false,
            showLessItems: true,
            onChange: (page) => setFilters((current) => ({ ...current, page })),
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} merchants`,
          }}
          className="[&_.ant-table-thead>tr>th]:bg-white! [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:p-4! [&_.ant-pagination]:px-4! [&_.ant-table-tbody>tr>td]:pl-4!"
        />
      </div>
    </div>
  );
}

export default SellerManagement;
