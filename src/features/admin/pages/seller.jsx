import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, Table, Tag } from "antd";
import {
  MdOutlineErrorOutline,
  MdOutlinePayments,
  MdOutlineStorefront,
  MdRefresh,
  MdSearch,
  MdVerified,
} from "react-icons/md";
import AnalyticalCard from "../components/analyticalCard";
import { money } from "../../../shared/utils/currency";
import { CATEGORIES, STATUS_OPTIONS } from "../constant/constant";

const DEFAULTS = { keyword: "", status: "all", category: "all", page: 1 };

const columns = [
  {
    title: "STORE & BRAND",
    render: (_, s) => (
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
          {s.store[0]}
        </span>
        <div>
          <p
            className={`m-0 flex items-center gap-1 text-xs font-bold text-slate-900`}
          >
            {s.store}
            <MdVerified className="text-indigo-600" />
          </p>
          <p className="m-0 font-mono text-[10px] text-slate-500">
            aura.market/{s.handle}
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "OWNER / CONTACT",
    render: (_, s) => (
      <>
        <p className="m-0 text-xs font-semibold text-slate-900">{s.owner}</p>
        <p className="m-0 text-[10px] text-slate-500">{s.email}</p>
      </>
    ),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    render: (c) => (
      <Tag color="#EAEDFF" className="text-[10px]! text-slate-700!">
        {c}
      </Tag>
    ),
  },
  { title: "PRODUCTS", dataIndex: "products", render: (n) => `${n} items` },
  {
    title: "MONTHLY GMV",
    dataIndex: "gmv",
    render: (v, s) => (
      <>
        <b className="text-xs">{money(v)}</b>
        <p className="m-0 text-[10px] text-slate-500">{s.orders} orders</p>
      </>
    ),
  },
];

const seller = [
  {
    id: 1,
    store: "Studio Kanso",
    handle: "studiokanso",
    owner: "Kenji Takahashi",
    email: "kenji@studiokanso.jp",
    category: "Ceramics & Tableware",
    products: 42,
    gmv: 14250,
    orders: 94,
    commission: 12,
    description: "Small-batch ceramics from Kyoto.",
  },
  {
    id: 2,
    store: "Echizen Craft",
    handle: "echizencraft",
    owner: "Sora Masuda",
    email: "support@echizencraft.co",
    category: "Kitchen & Dining",
    products: 28,
    gmv: 28940,
    orders: 142,
    commission: 12,
    description: "Traditional Echizen knives and cookware.",
  },
  {
    id: 3,
    store: "Oak Woodcraft",
    handle: "oakwoodcraft",
    owner: "Lars Lindqvist",
    email: "lars@oakwoodcraft.se",
    category: "Furniture",
    products: 15,
    gmv: 19400,
    orders: 22,
    commission: 10,

    description: "Solid oak furniture made in Sweden.",
  },
  {
    id: 4,
    store: "Pure Linen Lab",
    handle: "purelinenlab",
    owner: "Camille Laurent",
    email: "contact@purelinen.fr",
    category: "Textiles",
    products: 36,
    gmv: 11820,
    orders: 78,
    commission: 12,
    description: "Washed linen bedding and towels.",
  },
  {
    id: 5,
    store: "Ceramic Studio Co",
    handle: "ceramic-studio-co",
    owner: "Beatriz Ramos Carvalho",
    email: "b.carvalho@ceramicstudio.pt",
    category: "Ceramics & Tableware",
    products: 12,
    gmv: 0,
    orders: 0,
    commission: 12,
    description: "New applicant from Lisbon.",
  },
  {
    id: 6,
    store: "Alpine Woodworks",
    handle: "alpinewood",
    owner: "Markus Steiner",
    email: "m.steiner@alpinewood.at",
    category: "Furniture & Wood",
    products: 19,
    gmv: 1890,
    orders: 0,
    commission: 10,
    description: "Alpine timber furniture.",
  },
];
function SellerManagement() {
  const navigate = useNavigate();
  const [f, setF] = useState(DEFAULTS);

  const update = (patch) => setF((prev) => ({ ...prev, page: 1, ...patch }));

  const q = f.keyword.trim().toLowerCase();
  const filtered = seller.filter(
    (s) =>
      (!q ||
        [s.store, s.owner, s.email, s.handle].some((v) =>
          v.toLowerCase().includes(q),
        )) &&
      (f.status === "all" || s.status === f.status) &&
      (f.category === "all" || s.category === f.category),
  );

  const count = (status) => seller.filter((s) => s.status === status).length;
  const totalGmv = seller.reduce((sum, s) => sum + s.gmv, 0);

  const stats = [
    {
      icon: MdOutlineStorefront,
      title: "Total Sellers",
      amount: seller.length,
    },
    {
      icon: MdOutlineErrorOutline,
      title: "Pending Review",
      amount: count("pending"),
    },
    { icon: MdVerified, title: "Active Stores", amount: count("active") },
    { icon: MdOutlinePayments, title: "Seller GMV", amount: money(totalGmv) },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <h1 className="m-0 text-2xl font-bold text-slate-900 sm:text-3xl">
        Seller Management &amp; Approvals
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-lg text-xs">
        Manage onboarded merchant stores, review seller applications, and track
        seller performance across domestic and cross-border channels.
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

      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center">
        <Input
          allowClear
          variant="filled"
          placeholder="Search store, owner, email"
          value={f.keyword}
          onChange={(e) => update({ keyword: e.target.value })}
          prefix={<MdSearch className="text-lg text-slate-500" />}
          className="lg:max-w-60"
        />
        <Select
          variant="filled"
          value={f.status}
          onChange={(status) => update({ status })}
          options={[{ value: "all", label: "Status: All" }, ...STATUS_OPTIONS]}
          className="lg:w-44"
        />
        <Select
          variant="filled"
          value={f.category}
          onChange={(category) => update({ category })}
          options={[
            { value: "all", label: "All Categories" },
            ...CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
          className="lg:w-52"
        />
        <Button
          type="text"
          aria-label="Reset filters"
          className="lg:ml-auto"
          icon={<MdRefresh className="text-lg" />}
          onClick={() => setF(DEFAULTS)}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          scroll={{ x: 1000 }}
          onRow={(s) => ({
            className: "cursor-pointer",
            onClick: (e) => {
              if (e.target.closest(".ant-table-selection-column")) return;
              navigate(`/admin/sellers/${s.id}`);
            },
          })}
          locale={{ emptyText: "No seller match your filters" }}
          pagination={{
            current: f.page,
            pageSize: 10,
            showSizeChanger: false,
            showLessItems: true,
            onChange: (page) => setF((prev) => ({ ...prev, page })),
            showTotal: (total, [from, to]) =>
              `Showing ${from}-${to} of ${total} merchants`,
          }}
          className="[&_.ant-table-thead>tr>th]:bg-white!  [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:p-4! [&_.ant-pagination]:px-4!  [&_.ant-table-tbody>tr>td]:pl-4! "
        />
      </div>
    </div>
  );
}

export default SellerManagement;
