function StatCard({
  title,
  value,
  subtext,
  tag,
  icon,
  isAlert,
  iconClassName = "",
}) {
  return (
    <div
      className="flex  min-w-0 flex-col rounded-2xl border border-slate-800 p-3 shadow-sm sm:p-4 lg:p-5"
      style={{ background: "var(--workspace-surface)" }}
    >
      <div className="mb-3 flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 break-words text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
          {title}
        </span>

        {icon && (
          <div
            className={`shrink-0 rounded-lg p-1 sm:p-1.5 ${
              iconClassName ||
              (isAlert
                ? "bg-red-900/30 text-red-400"
                : "bg-slate-800 text-slate-400")
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mb-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 sm:mb-4">
        <h2 className="m-0 break-words text-2xl font-bold leading-none text-slate-100 sm:text-[28px] lg:text-[32px]">
          {value}
        </h2>

        {subtext && (
          <span className="text-xs font-semibold text-slate-400 sm:text-sm">
            {subtext}
          </span>
        )}
      </div>

      {tag && <div className="mt-auto">{tag}</div>}
    </div>
  );
}

export default StatCard;
