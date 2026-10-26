import { Button, Tag } from "antd";
import {
  MdBlock,
  MdClose,
  MdOutlineMessage,
  MdOutlineNoteAdd,
  MdOutlinePlace,
  MdOutlineShoppingBag,
  MdVerified,
} from "react-icons/md";
import Stat from "./stats";
import { money } from "../../../shared/utils/currency";
import { initials, STATUS_TAG } from "../constant/constant";

function CustomerInspector({
  customer,
  onClose,
  onDeactivate,
  onMessage,
  onNote,
}) {
  if (!customer) {
    return (
      <aside className="rounded-2xl bg-white p-6 text-center text-xs text-slate-500 shadow-sm ring-1 ring-slate-100">
        Select a customer row to open the inspector.
      </aside>
    );
  }

  const tag = STATUS_TAG[customer.status] ?? {
    label: customer.status,
    color: "default",
  };

  return (
    <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <p className="m-0 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          Inspector Panel
        </p>
        <div className="flex items-center gap-2">
          <Tag color={tag.color} bordered={false} className="m-0! text-[10px]!">
            {tag.label} Account
          </Tag>
          <button
            type="button"
            aria-label="Close inspector"
            onClick={onClose}
            className="flex cursor-pointer text-slate-500 hover:text-slate-800"
          >
            <MdClose />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-indigo-50/60 p-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-lg font-bold text-white">
          {initials(customer.name)}
        </span>
        <div className="min-w-0">
          <p className="m-0 flex items-center gap-1 text-sm font-bold text-slate-900">
            {customer.name}
            <MdVerified className="text-indigo-600" />
          </p>
          <p className="m-0 truncate text-[11px] text-slate-600">
            {customer.email}
          </p>
          <p className="m-0 text-[10px] text-slate-500">
            Member since {customer.joined} • ID: {customer.id}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Stat label="Orders" value={customer.orders} />
        <Stat label="Lifetime" value={money(customer.spent)} />
        <Stat label="Disputes" value={customer.disputes} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="m-0 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <MdOutlinePlace className="text-sm" />
          Default Shipping Address
        </p>
        <button
          type="button"
          className="cursor-pointer text-[11px] font-semibold text-indigo-600"
        >
          Edit
        </button>
      </div>
      <div className="mt-2 rounded-xl bg-indigo-50/60 p-3 text-xs text-slate-700">
        {customer.address.length === 0 && (
          <p className="m-0 text-slate-500">No shipping address available.</p>
        )}
        {customer.address.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="m-0 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <MdOutlineShoppingBag className="text-sm" />
          Recent Orders ({customer.recent.length})
        </p>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {customer.recent.length === 0 && (
          <p className="m-0 text-[11px] text-slate-500">
            No recent orders to show.
          </p>
        )}
        {customer.recent.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3"
          >
            <div>
              <p className="m-0 text-xs font-bold text-slate-900">
                Order #{o.id}
              </p>
              <p className="m-0 text-[10px] text-slate-500">{o.meta}</p>
            </div>
            <div className="text-right">
              <p className="m-0 text-xs font-bold text-slate-900">
                {money(o.amount)}
              </p>
              <p className={`m-0 text-[10px] font-semibold text-emerald-700`}>
                {o.state}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="m-0 mt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Administrative Actions
      </p>
      <div className="mt-2 flex flex-col gap-2">
        <Button
          type="primary"
          icon={<MdOutlineMessage />}
          onClick={onMessage}
          className="bg-indigo-700!"
        >
          Send Direct Message / Email
        </Button>
        <Button
          icon={<MdOutlineNoteAdd />}
          onClick={onNote}
          className="bg-indigo-50! text-indigo-700!"
        >
          Change Password
        </Button>
        <Button
          danger
          icon={<MdBlock />}
          disabled={customer.status === "suspended"}
          onClick={onDeactivate}
        >
          {customer.status === "suspended"
            ? "Account Deactivated"
            : "Deactivate Account"}
        </Button>
      </div>

      {customer.memo && (
        <div className="mt-5">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Latest Staff Memo
          </p>
          <p className="m-0 mt-2 rounded-xl bg-indigo-50/60 p-3 text-[11px] italic leading-relaxed text-slate-600">
            “{customer.memo}”
          </p>
        </div>
      )}
    </aside>
  );
}

export default CustomerInspector;
