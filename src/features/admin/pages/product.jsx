import { useState } from "react";
import { Button, Input, Select, Table, Tag } from "antd";
import {
  MdCheckCircleOutline,
  MdOpenInNew,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdSearch,
  MdBlock,
} from "react-icons/md";
import ProductView from "../components/productView";
import AnalyticalCard from "../components/analyticalCard";

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Handcrafted Ceramic Carafe & Cups Set",
    sku: "CR-90214-WHT",
    category: "Ceramics",
    seller: "Studio Kanso",
    image: "/images/products/carafe.jpg",
    price: 148,
    tier: "High-Value",
    stock: 24,
    velocity: "Healthy velocity",
    commissionRate: 12,
    rating: 4.9,
    reviews: 128,
    returnRate: 0.8,
    status: "active",
  },
  {
    id: 2,
    name: "Washed Belgian Linen Duvet Cover",
    sku: "TX-44182-NAT",
    category: "Textiles",
    seller: "Loom & Warp Co.",
    image: "/images/products/duvet.jpg",
    price: 210,
    tier: "High-Value",
    stock: 41,
    velocity: "Healthy velocity",
    commissionRate: 12,
    rating: 4.8,
    reviews: 96,
    returnRate: 1.2,
    status: "active",
  },
  {
    id: 3,
    name: 'Cast Iron Dutch Skillet 11"',
    sku: "KW-10992-BLK",
    category: "Kitchenware",
    seller: "Apex Metals",
    image: "/images/products/skillet.jpg",
    price: 89,
    tier: "Standard",
    stock: 12,
    velocity: "Steady velocity",
    commissionRate: 10,
    rating: 3.9,
    reviews: 22,
    returnRate: 6.4,
    status: "flagged",
  },
  {
    id: 4,
    name: "Sculptural Oak Lounge Stool",
    sku: "FN-55100-OAK",
    category: "Furniture",
    seller: "Nordic Atelier",
    image: "",
    price: 320,
    tier: "Premium",
    stock: 6,
    velocity: "Low stock",
    commissionRate: 12,
    rating: 4.7,
    reviews: 38,
    returnRate: 0.5,
    status: "active",
  },
  {
    id: 5,
    name: "Raw Terracotta Planter Basin",
    sku: "CR-31002-TER",
    category: "Ceramics",
    seller: "Terracotta Works",
    image: "/images/products/planter.jpg",
    price: 64,
    tier: "Standard",
    stock: 0,
    velocity: "Restock required",
    commissionRate: 10,
    rating: 4.6,
    reviews: 51,
    returnRate: 1.9,
    status: "out-of-stock",
  },
  {
    id: 6,
    name: "Smoke Glass Coupes (Set of 4)",
    sku: "KW-88219-SMK",
    category: "Kitchenware",
    seller: "Studio Kanso",
    image: "/images/products/coupes.jpg",
    price: 96,
    tier: "Standard",
    stock: 33,
    velocity: "Healthy velocity",
    commissionRate: 10,
    rating: 4.8,
    reviews: 74,
    returnRate: 0.9,
    status: "active",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function ProductCatalog({ initialProducts = SAMPLE_PRODUCTS }) {
  const [products, setProducts] = useState(initialProducts);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [inspectedId, setInspectedId] = useState(
    initialProducts[0]?.id ?? null,
  );

  const inspected = products.find((p) => p.id === inspectedId) ?? null;
  const filteredProducts = products.filter((p) => {
    const search = keyword.toLowerCase();

    const matchesKeyword =
      p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search) ||
      p.seller.toLowerCase().includes(search);

    const matchesStatus = status === "all" || p.status === status;

    return matchesKeyword && matchesStatus;
  });
  const activeCount = products.filter((p) => p.status === "active").length;
  const outCount = products.filter((p) => p.status === "out-of-stock").length;

  const changeFilter = (setter) => (value) => {
    setter(value);
  };

  const handleDeactivate = () => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedKeys.includes(p.id) ? { ...p, status: "inactive" } : p,
      ),
    );
    setSelectedKeys([]);
  };

  const handleActivate = () => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedKeys.includes(p.id) ? { ...p, status: "inactive" } : p,
      ),
    );
    setSelectedKeys([]);
  };

  const columns = [
    {
      title: "PRODUCT & SKU",
      dataIndex: "name",
      key: "name",
      render: (_, p) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">
            {p.image ? (
              <img
                src={p.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <MdOutlineInventory2 />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`m-0 text-xs font-semibold ${
                p.status === "flagged" ? "text-red-600" : "text-slate-900"
              }`}
            >
              {p.name}
            </p>
            <p
              className={`m-0 mt-0.5 font-mono text-[10px] ${
                p.status === "flagged"
                  ? "font-bold text-red-600"
                  : "text-slate-500"
              }`}
            >
              SKU: {p.sku}
              {p.status === "flagged" && " • Flagged: Counterfeit claim"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (c) => (
        <Tag color="#EAEDFF" className="text-[10px]! text-slate-700!">
          {c}
        </Tag>
      ),
    },
    {
      title: "SELLER",
      dataIndex: "seller",
      key: "seller",
      render: (s) => (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700">
          {s}
          <MdOpenInNew className="text-xs" />
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl  p-4 ">
      <p className="m-0 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Catalog &amp; Inventory
        <span className="text-slate-300">•</span>
        <span className="text-indigo-700">Live Production</span>
      </p>
      <h1 className="m-0 mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        Product Catalog Management
      </h1>
      <p className="theme-muted m-0 mt-2 max-w-md text-xs leading-relaxed">
        Manage marketplace listings, review flagged items, and update catalog
        categories.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <AnalyticalCard
          icon={<MdOutlineInventory2 className="size-4" />}
          title="Total Products"
          amount={products.length.toLocaleString()}
          note="+4.2%"
          noteClass="text-indigo-700"
          percent={100}
          barColor="#3730a3"
        />
        <AnalyticalCard
          icon={<MdCheckCircleOutline className="size-4" />}
          title="Active Listings"
          amount={activeCount.toLocaleString()}
        />
        <AnalyticalCard
          icon={<MdOutlineShoppingCart className="size-4" />}
          title="Out of Stock"
          amount={outCount.toLocaleString()}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 xl:flex-row xl:items-center">
        <Input
          allowClear
          variant="filled"
          placeholder="Filter by product name, SKU, or brand"
          value={keyword}
          onChange={(e) => changeFilter(setKeyword)(e.target.value)}
          prefix={<MdSearch className="text-lg text-slate-500" />}
          className="xl:max-w-64"
        />
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            variant="filled"
            value={status}
            onChange={changeFilter(setStatus)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {selectedKeys.length > 0 && (
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-xs font-medium text-slate-700">
                {selectedKeys.length}{" "}
                {selectedKeys.length === 1 ? "item" : "items"} selected
              </span>
              <div className="space-x-2 ">
                <Button
                  danger
                  size="small"
                  icon={<MdBlock />}
                  onClick={handleDeactivate}
                  className="text-xs!"
                >
                  Deactivate
                </Button>
                <Button
                  variant="solid"
                  size="small"
                  onClick={handleActivate}
                  className="text-xs!"
                >
                  Activate
                </Button>
              </div>
            </div>
          )}

          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredProducts}
            scroll={{ x: 520 }}
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: setSelectedKeys,
            }}
            onRow={(record) => ({
              onClick: () => setInspectedId(record.id),
              className: "cursor-pointer",
            })}
            rowClassName={(record) =>
              [
                record.id === inspectedId ? "row-active" : "",
                record.status === "flagged" ? "row-flagged" : "",
              ].join(" ")
            }
            locale={{ emptyText: "No products match your filters" }}
            className="[&_.ant-table-thead>tr>th]:bg-white! [&_.ant-table-thead>tr>th]:text-[10px]! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-tbody>tr.row-active>td]:bg-indigo-50! [&_.ant-table-tbody>tr.row-flagged>td]:bg-red-50/60! [&_.ant-table-thead>tr>th]:p-4!  "
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <ProductView
            product={inspected}
            onClose={() => setInspectedId(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;
