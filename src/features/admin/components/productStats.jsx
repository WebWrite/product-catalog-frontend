function ProductStatCard({
  icon,
  label,
  value,
  note,
  noteClass,
  percent,
  barColor,
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </p>
        <span className="flex size-6 items-center justify-center rounded-md bg-indigo-50 text-sm text-slate-600">
          {icon}
        </span>
      </div>
      <p className="m-0 mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className={`text-[11px] font-semibold ${noteClass}`}>{note}</span>
      </p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export default ProductStatCard;
