import { useState } from "react";
import { Tag } from "antd";
import { MdOutlineInventory2 } from "react-icons/md";
import ItemRow from "../components/orderItem";
import Ledger from "../components/ledger";
import Recipient from "../components/orderRecipient";

const initialOrder = {
  id: "ORD-89421",
  placedAt: "Oct 29, 2024 at 10:42 AM",
  customer: {
    name: "Elena Vance",
    vip: true,
    email: "elena.vance@auramarket.design",
    phone: "+1 (917) 555-0192",
    ltv: "$4.2K",
  },
  items: [
    {
      id: 1,
      name: "Handcrafted Ceramic Carafe & Cups Set",
      seller: "Studio Kanso",
      location: "Kyoto, JP",
      qty: 1,
      unitPrice: 148,
      status: "shipped",
      image: "/images/products/carafe.jpg",
    },
    {
      id: 2,
      name: "Linen Tea Towel Set",
      variant: "Slate Grey",
      seller: "Pure Linen Lab",
      location: "Lisbon, PT",
      qty: 2,
      unitPrice: 31,
      status: "refunded",
      refundedAt: "Oct 29, 2:30 PM",
      image: "/images/products/towel.jpg",
    },
    {
      id: 3,
      name: "Raw Terracotta Planter Basin",
      seller: "Terracotta Works",
      location: "Valencia, ES",
      qty: 1,
      unitPrice: 89.5,
      status: "processing",
      note: "Seller notified Oct 29 • Packing slip downloaded by vendor 3 hrs ago",
      image: "/images/products/planter.jpg",
    },
  ],
  shipping: {
    address: [
      "Elena Vance c/o Dwell Loft",
      "142 Water Street, Loft 4B",
      "Brooklyn, NY 11201 — United States",
    ],
    instructions: "Leave with Doorman or 4th fl vestibule",
  },
};

function OrderDetail() {
  const [items, setItems] = useState(initialOrder.items);
  const { customer } = initialOrder;

  const changeStatus = (id, status) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status,
              refundedAt: status === "refunded" ? "Just now" : i.refundedAt,
            }
          : i,
      ),
    );

  return (
    <div className="mx-auto w-full max-w-6xl p-4 ">
      <h1 className="m-0 mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        Order #{initialOrder.id}
      </h1>
      <p className="m-0 mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        Placed {initialOrder.placedAt} • Customer:
        <span className="font-semibold text-slate-900">{customer.name}</span>
        {customer.vip && (
          <Tag color="#EAEDFF" className="m-0! text-[10px]! text-indigo-700!">
            VIP
          </Tag>
        )}
      </p>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="m-0 flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <MdOutlineInventory2 />
            </span>
            Order Items
          </h2>
          <Tag className="m-0! hidden text-[9px]! uppercase sm:inline-block">
            Fulfillment sync: real-time
          </Tag>
        </div>

        {items.map((item) => (
          <ItemRow key={item.id} item={item} onStatus={changeStatus} />
        ))}
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Ledger items={items} />
        <Recipient
          customer={customer}
          shipping={initialOrder.shipping}
          payment={initialOrder.payment}
        />
      </div>
    </div>
  );
}

export default OrderDetail;
