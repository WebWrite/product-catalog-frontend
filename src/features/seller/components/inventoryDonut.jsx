import { Progress, Tooltip } from "antd";

function InventoryDonut({ data, isLoading }) {
  const healthyStock = data?.healthyStock;
  const lowStock = data?.lowStock;
  const soldOut = data?.soldOut;

  return (
    <div
      className="flex min-w-0 flex-1 flex-col rounded-2xl border border-slate-800 p-4 shadow-sm sm:p-5 lg:p-6"
      style={{ background: "var(--workspace-surface)" }}
    >
      <div className="mb-5 sm:mb-6">
        <h3 className="m-0 text-lg font-bold text-slate-100">
          Inventory Health
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Kiln yield vs active marketplace commitments
        </p>
      </div>

      <div className="relative mb-6 flex justify-center sm:mb-8">
        <Progress
          type="circle"
          percent={healthyStock?.percentage ?? 0}
          strokeColor="#818CF8"
          railColor="#334155"
          size={160}
          strokeWidth={12}
          format={(percent) => (
            <div className="flex flex-col items-center">
              <span className="text-[28px] font-bold text-slate-100 leading-none">
                {isLoading ? "..." : `${percent}%`}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">
                Availability
              </span>
            </div>
          )}
        />
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 font-medium text-slate-400">
            <span className="size-2.5 shrink-0 rounded-full bg-indigo-500"></span>{" "}
            <span className="truncate">Healthy Stock (&gt;5 items)</span>
          </span>
          <TooltipValue
            value={
              isLoading
                ? "..."
                : `${healthyStock?.percentage ?? 0}% (${healthyStock?.count ?? 0} SKUs)`
            }
          />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 font-medium text-slate-400">
            <span className="size-2.5 shrink-0 rounded-full bg-purple-500"></span>
            <span className="truncate">Critical Low (&lt;4 items)</span>
          </span>
          <TooltipValue
            value={
              isLoading
                ? "..."
                : `${lowStock?.percentage ?? 0}% (${lowStock?.count ?? 0} SKUs)`
            }
          />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 font-medium text-slate-400">
            <span className="size-2.5 shrink-0 rounded-full bg-red-500"></span>
            <span className="truncate">Sold Out</span>
          </span>
          <TooltipValue
            value={
              isLoading
                ? "..."
                : `${soldOut?.percentage ?? 0}% (${soldOut?.count ?? 0} SKUs)`
            }
          />
        </div>
      </div>
    </div>
  );
}

function TooltipValue({ value }) {
  return (
    <Tooltip title={value} mouseEnterDelay={0.2}>
      <span
        className="min-w-0 max-w-[52%] shrink-0 truncate text-right font-bold text-slate-200"
        tabIndex={0}
      >
        {value}
      </span>
    </Tooltip>
  );
}

export default InventoryDonut;
