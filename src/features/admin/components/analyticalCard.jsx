function AnalyticalCard({ title, amount, icon }) {
  return (
    <div className="rounded-xl   bg-white h-22 p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xs font-medium">{title}</h1>
        <p className="mt-3 text-lg font-bold text-black">{amount}</p>
      </div>
      <div className="bg-violet-100 rounded-lg p-2 text-indigo-800 ">
        {icon}
      </div>
    </div>
  );
}

export default AnalyticalCard;
