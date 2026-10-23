import {
  MdLockOutline,
  MdOutlineInventory2,
  MdOutlineLocalShipping,
  MdOutlineStorefront,
} from "react-icons/md";
import { money } from "../../../shared/utils/currency";
import { Button, Select, Tag } from "antd";
import {
  DELIEVERY_STATUS_OPTIONS,
  lineTotal,
  STATUS,
} from "../constant/constant";

function ItemRow({ item, onStatus, isUpdating = false }) {
  const st = STATUS[item.status] ?? STATUS.pending;

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 p-4 last:border-0 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <MdOutlineInventory2 />
          )}
        </div>

        <div className="min-w-0">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-bold ${
                item.status === "cancelled"
                  ? "text-slate-500 line-through"
                  : "text-slate-900"
              }`}
            >
              {item.name}
            </span>
            {item.variant && (
              <Tag
                color="#EAEDFF"
                className="m-0! text-[10px]! text-slate-700!"
              >
                {item.variant}
              </Tag>
            )}
          </p>

          <p className="m-0 mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
            <MdOutlineStorefront className="text-sm text-indigo-700" />
            Seller: <span className="font-semibold">{item.seller}</span> (
            {item.location})
          </p>

          <p className="m-0 mt-1 text-[11px] text-slate-600">
            Qty: {item.qty} •{" "}
            {item.qty > 1 ? (
              <>
                {money(item.unitPrice)} ea •{" "}
                <b
                  className={
                    item.status === "cancelled"
                      ? "text-red-600"
                      : "text-slate-900"
                  }
                >
                  Total: {money(lineTotal(item))}
                </b>
              </>
            ) : (
              <b className="text-slate-900">{money(item.unitPrice)}</b>
            )}
          </p>

          {item.note && (
            <p className="m-0 mt-2 rounded-md bg-indigo-50 px-2 py-1 text-[10px] text-slate-600">
              {item.note}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 rounded-xl bg-indigo-50/60 p-3 lg:w-[22rem]">
        <div className="min-w-36 flex-1">
          <p className="m-0 mb-1.5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            Current Status
            <Tag color={st.color} className="m-0! text-[9px]!">
              {st.label}
            </Tag>
          </p>
          <Select
            size="small"
            className="w-full"
            value={item.status}
            options={DELIEVERY_STATUS_OPTIONS}
            loading={isUpdating}
            disabled={isUpdating}
            suffixIcon={isUpdating ? <MdLockOutline /> : undefined}
            onChange={(v) => onStatus(item.id, v)}
          />
        </div>

        {item.status === "processing" && (
          <>
            <Button
              size="small"
              type="primary"
              icon={<MdOutlineLocalShipping />}
              className="bg-indigo-700!"
              onClick={() => onStatus(item.id, "shipped")}
              loading={isUpdating}
            >
              Dispatch Item
            </Button>
            <Button
              size="small"
              danger
              onClick={() => onStatus(item.id, "cancelled")}
              disabled={isUpdating}
            >
              Cancel Item
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ItemRow;
