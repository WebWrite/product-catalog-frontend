function AnalyticalCard({ title, amount, icon }) {
  return (
    <div className="flex min-w-0 h-22 items-center justify-between gap-3 rounded-xl bg-white p-3 sm:p-4">
      <div className="min-w-0">
        <h1 className="text-xs font-medium">{title}</h1>
        <p className="mt-3 truncate text-lg font-bold text-black" title={amount}>
          {amount}
        </p>
      </div>
      <div className="shrink-0 rounded-lg bg-violet-100 p-2 text-indigo-800">
        {icon}
      </div>
    </div>
  );
}

export default AnalyticalCard;
