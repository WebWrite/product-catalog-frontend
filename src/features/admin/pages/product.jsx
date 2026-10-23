import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Input, Pagination, Select, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  getAdminProductById,
  getAdminProducts,
  getAdminProductSummary,
  deleteAdminProduct,
} from "../api/api";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const PAGE_SIZE = 15;

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id,
    sku: product.sku ?? product._id,
    seller: product.seller?.storeName ?? product.sellerId?.name ?? "Unknown seller",
    image: product.image?.url ?? product.image ?? "",
    tier: product.tier ?? "Standard",
    velocity:
      product.stock === 0
        ? "Restock required"
        : product.stock < 10
          ? "Low stock"
          : "Healthy velocity",
    commissionRate: product.commissionRate ?? 0,
    rating: product.rating ?? "-",
    reviews: product.reviews ?? 0,
    returnRate: product.returnRate ?? 0,
  };
}

function ProductCatalog() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [inspectedId, setInspectedId] = useState(null);
  const { modal, notification } = App.useApp();
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: ["admin", "products", "summary"],
    queryFn: getAdminProductSummary,
  });
  const productsQuery = useQuery({
    queryKey: ["admin", "products", { page, keyword, status }],
    queryFn: () =>
      getAdminProducts({
        page,
        limit: PAGE_SIZE,
        search: keyword,
        ...(status === "active" ? { inStock: true } : {}),
      }),
  });
  const inspectedQuery = useQuery({
    queryKey: ["admin", "product", inspectedId],
    queryFn: () => getAdminProductById(inspectedId),
    enabled: !!inspectedId,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products", "summary"] });
      setInspectedId(null);
      notification.success({
        title: "Product deleted",
        description: "The product was deleted successfully.",
        placement: "bottomRight",
      });
    },
    onError: (error) => {
      notification.error({
        title: "Could not delete product",
        description: error?.response?.data?.message ?? "Failed to delete product.",
        placement: "bottomRight",
      });
    },
  });

  const products = (productsQuery.data?.products ?? []).map(normalizeProduct);
  const filteredProducts =
    status === "inactive"
      ? products.filter((product) => product.status === "inactive")
      : products;
  const inspected = inspectedQuery.data
    ? normalizeProduct(inspectedQuery.data)
    : null;
  const confirmDelete = () => {
    if (!inspectedId) return;
    modal.confirm({
      title: "Delete this product?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(inspectedId),
    });
  };
  const summary = summaryQuery.data ?? {};

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedKeys([]);
  };

  const handleDeactivate = () => {
    setSelectedKeys([]);
  };

  const handleActivate = () => {
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
          amount={summaryQuery.isLoading ? "..." : (summary.totalProduct ?? 0).toLocaleString()}
          percent={100}
          barColor="#3730a3"
        />
        <AnalyticalCard
          icon={<MdCheckCircleOutline className="size-4" />}
          title="Active Listings"
          amount={summaryQuery.isLoading ? "..." : (summary.activeProduct ?? 0).toLocaleString()}
        />
        <AnalyticalCard
          icon={<MdOutlineShoppingCart className="size-4" />}
          title="Out of Stock"
          amount={summaryQuery.isLoading ? "..." : (summary.outOfStock ?? 0).toLocaleString()}
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
            loading={productsQuery.isLoading}
            pagination={false}
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
          <div className="flex justify-end border-t border-slate-100 p-4">
            <Pagination
              current={productsQuery.data?.page ?? page}
              pageSize={productsQuery.data?.limit ?? PAGE_SIZE}
              total={productsQuery.data?.total ?? 0}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <ProductView
            product={inspected}
            onClose={() => setInspectedId(null)}
            onEdit={() => navigate(`/admin/products/${inspectedId}/edit`)}
            onDelete={confirmDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;
