import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tooltip } from "antd";
import { MdEdit, MdOpenInNew } from "react-icons/md";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { money } from "../../../shared/utils/currency";

const LOW_STOCK = 5;

function StockBar({ stock }) {
  const out = stock === 0;
  const low = stock <= LOW_STOCK;
  const text = out ? "text-red-400" : low ? "text-amber-400" : "text-slate-300";

  return (
    <div className="w-28">
      <p className={`m-0 text-xs font-semibold ${text}`}>
        {out ? "Out of stock" : `${stock} in stock`}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-slate-500/10 text-slate-400"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-slate-500"}`}
      />
      {status}
    </span>
  );
}

function PriorityQueueTable() {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);

  const { data, isLoading, isError } = useSellerProducts();

  const products = data?.products ?? [];
  const total = data?.pagination?.total ?? 0;

  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, p) => (
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700">
            {p.image?.url && (
              <img
                src={p.image.url}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="m-0 line-clamp-1 text-sm font-semibold capitalize text-slate-100">
              {p.name}
            </p>
            <p className="m-0 mt-0.5 line-clamp-1 text-xs capitalize text-slate-500">
              {p.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "STOCK",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => <StockBar stock={stock} />,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span className="text-sm font-bold text-slate-100">{money(price)}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (s) => <StatusPill status={s} />,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, p) => (
        <div
          className="flex justify-end gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit product">
            <Button
              type="text"
              shape="circle"
              aria-label="Edit product"
              icon={<MdEdit />}
              onClick={() => navigate("/seller/products")}
            />
          </Tooltip>
          <Tooltip title="View in shop">
            <Button
              type="text"
              shape="circle"
              aria-label="View in shop"
              icon={<MdOpenInNew />}
              onClick={() => window.open(`/shop/${p._id}`, "_blank")}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div
      className="mt-2 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 shadow-lg shadow-black/20"
      style={{ background: "var(--workspace-surface)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5">
        <div>
          <h3 className="m-0 text-base font-bold text-slate-100 lg:text-lg">
            Cataloged Products
          </h3>
          <p className="m-0 mt-0.5 text-xs text-slate-500">
            {total} {total === 1 ? "item" : "items"} in your catalog
          </p>
        </div>
        <Button
          type="primary"
          size="small"
          onClick={() => navigate("/seller/products")}
          className="px-4 font-semibold"
        >
          View All
        </Button>
      </div>

      {isError ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Failed to load products.
        </div>
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products}
          loading={isLoading}
          scroll={{ x: 680 }}
          rowClassName="group cursor-pointer"
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          onClick={() => navigate("/seller/products")}
          locale={{
            emptyText:
              products.length === 0
                ? "No products yet."
                : "No products match your filters",
          }}
          className="[&_.ant-table-thead>tr>th]:text-[11px]! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:before:hidden! [&_.ant-table-tbody>tr:last-child>td]:border-b-0!"
        />
      )}
    </div>
  );
}

export default PriorityQueueTable;
