import { Tag } from "antd";
import { MdOutlinePersonOutline, MdOutlinePlace } from "react-icons/md";

function Recipient({ customer, shipping }) {
  const initials = customer.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-sm font-bold text-slate-900">
          <MdOutlinePersonOutline className="text-indigo-700" />
          Recipient &amp; Delivery
        </h2>
        <button
          type="button"
          className="cursor-pointer text-xs font-semibold text-indigo-600"
        >
          Edit
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-indigo-50/60 p-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="m-0 flex items-center gap-2 text-sm font-bold text-slate-900">
            {customer.name}
            <Tag color="#EAEDFF" className="m-0! text-[9px]! text-indigo-700!">
              LTV {customer.ltv}
            </Tag>
          </p>
          <p className="m-0 truncate text-[11px] text-slate-600">
            {customer.email}
          </p>
          <p className="m-0 text-[11px] text-slate-600">{customer.phone}</p>
        </div>
      </div>

      <p className="m-0 mt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Shipping Destination
      </p>
      <div className="mt-2 rounded-xl bg-indigo-50/60 p-3 text-xs text-slate-700">
        <p className="m-0 flex gap-2">
          <MdOutlinePlace className="mt-0.5 shrink-0 text-indigo-700" />
          <span>
            {shipping.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </p>
        <p className="m-0 mt-3 rounded-md bg-white px-2 py-1.5 text-[11px]">
          <b>Delivery Instructions:</b> {shipping.instructions}
        </p>
      </div>
    </section>
  );
}

export default Recipient;
