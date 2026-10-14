function StatCard({ title, value, subtext, tag, icon, isAlert }) {
  return (
    <div className="p-4 md:p-5 rounded-2xl w-[calc(50%-8px)] lg:w-auto lg:flex-1 min-w-[160px] border border-slate-800 shadow-sm" style={{ background: '#1E293B' }}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={`p-1 md:p-1.5 rounded-lg ${isAlert ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1 md:gap-2 mb-3 md:mb-4 flex-wrap">
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-slate-100 m-0 leading-none">{value}</h2>
        <span className="text-xs md:text-sm font-semibold text-slate-400">{subtext}</span>
      </div>
      {tag && (
         <div className="mt-auto">
            {tag}
         </div>
      )}
    </div>
  );
}

export default StatCard;