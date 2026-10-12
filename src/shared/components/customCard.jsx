function CustomCard({ title, desc, icon }) {
  return (
    <div className=" rounded-2xl bg-white px-4 py-3 max-w-100 h-32  flex justify-center items-center">
      <div className="flex items-start gap-4">
        <div className="bg-violet-100 h-10 w-10 shrink-0 rounded-xl flex justify-center items-center text-sm text-indigo-800">
          {icon}
        </div>
        <div className="flex flex-col gap-1 ">
          <h3 className="text-lg font-semibold"> {title}</h3>
          <p className=" theme-muted  font-sans text-xs">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomCard;
