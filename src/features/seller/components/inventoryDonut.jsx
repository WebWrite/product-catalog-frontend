import { Progress } from "antd";

function InventoryDonut({ data, isLoading }) {
  const healthyStock = data?.healthyStock;
  const lowStock = data?.lowStock;
  const soldOut = data?.soldOut;

  return (
    <div
      className="p-6 rounded-2xl border border-slate-800 flex-1 shadow-sm flex flex-col"
      style={{ background: "var(--workspace-surface)" }}
    >
      <div className="mb-6">
        <h3 className="m-0 font-bold text-lg text-slate-100">
          Inventory Health
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Kiln yield vs active marketplace commitments
        </p>
      </div>

      <div className="flex justify-center mb-8 relative">
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

      <div className="space-y-4 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>{" "}
            Healthy Stock (&gt;5 items)
          </span>
          <span className="font-bold text-slate-200">
            {isLoading
              ? "..."
              : `${healthyStock?.percentage ?? 0}% (${healthyStock?.count ?? 0} SKUs)`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>{" "}
            Critical Low (&lt;4 items)
          </span>
          <span className="font-bold text-slate-200">
            {isLoading
              ? "..."
              : `${lowStock?.percentage ?? 0}% (${lowStock?.count ?? 0} SKUs)`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Sold
            Out
          </span>
          <span className="font-bold text-slate-200">
            {isLoading
              ? "..."
              : `${soldOut?.percentage ?? 0}% (${soldOut?.count ?? 0} SKUs)`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InventoryDonut;
