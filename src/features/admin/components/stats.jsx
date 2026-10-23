function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-indigo-50/60 p-2.5 text-center">
      <p className="m-0 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="m-0 mt-1 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default Stat;
