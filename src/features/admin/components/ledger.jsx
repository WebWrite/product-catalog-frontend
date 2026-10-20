import { Tag } from "antd";
import { MdOutlineReceiptLong } from "react-icons/md";
import { money } from "../../../shared/utils/currency";
import { COMMISSION_RATE, SHIPPING, TAX_RATE } from "../constant/constant";

function Row({ label, value, className = "" }) {
  return (
    <div className={`flex items-center justify-between text-xs ${className}`}>
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

const isActive = (i) => i.status !== "refunded" && i.status !== "cancelled";
const lineTotal = (i) => i.qty * i.unitPrice;

function Ledger({ items }) {
  const subtotal = items.reduce((n, i) => n + lineTotal(i), 0);
  const tax = subtotal * TAX_RATE;
  const refunds = items
    .filter((i) => i.status === "refunded")
    .reduce((n, i) => n + lineTotal(i), 0);
  const netPaid = subtotal + SHIPPING + tax - refunds;

  const sellers = [...new Set(items.map((i) => i.seller))].map((name) => {
    const own = items.filter((i) => i.seller === name);
    const live = own.filter(isActive);
    const gross = live.reduce((n, i) => n + lineTotal(i), 0);
    const commission = gross * COMMISSION_RATE;
    const allShipped =
      live.length > 0 && live.every((i) => i.status === "shipped");
    return {
      name,
      count: own.length,
      commission,
      payout: gross - commission,
      state: live.length === 0 ? "clawed" : allShipped ? "ready" : "hold",
    };
  });

  const STATE = {
    ready: { text: "Ready for Release", cls: "text-indigo-700" },
    hold: { text: "Escrow Hold (Unshipped)", cls: "text-red-600" },
    clawed: { text: "Clawed back", cls: "text-red-600" },
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-sm font-bold text-slate-900">
          <MdOutlineReceiptLong className="text-indigo-700" />
          Financial Ledger
        </h2>
        <Tag className="m-0! text-[10px]!">Stripe Split</Tag>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Row label="Items subtotal" value={money(subtotal)} />
        <Row label="Calculated Combined Shipping" value={money(SHIPPING)} />
        <Row label="State Sales Tax (NY 8.875%)" value={money(tax)} />
        {refunds > 0 && (
          <Row
            label="Item Refund (Pure Linen Lab)"
            value={`-${money(refunds)}`}
            className="rounded-md bg-red-50 px-2 py-1 [&_span]:text-red-600!"
          />
        )}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-bold text-slate-900">
          Customer Net Paid
        </span>
        <span className="text-2xl font-bold text-indigo-700">
          {money(netPaid)}
        </span>
      </div>

      <p className="m-0 mt-6 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Escrow Payout Allocation
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {sellers.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3"
          >
            <div>
              <p className="m-0 text-xs font-semibold text-slate-900">
                {s.name} ({s.count} {s.count === 1 ? "item" : "items"})
              </p>
              <p className="m-0 mt-0.5 text-[10px] text-slate-500">
                Commission: 12% ({money(s.commission)})
              </p>
            </div>
            <div className="text-right">
              <p className="m-0 text-xs font-bold text-slate-900">
                {money(s.payout)}
              </p>
              <p
                className={`m-0 mt-0.5 text-[10px] font-semibold ${STATE[s.state].cls}`}
              >
                {STATE[s.state].text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ledger;
