import { MdDonutLarge } from "react-icons/md";

const DEFAULT_CATEGORIES = [
  { name: "Home & Ceramics", percent: 42, amount: 53949, color: "#2e1fb0" },
  {
    name: "Kitchenware & Cookware",
    percent: 28,
    amount: 35966,
    color: "#6d3df0",
  },
  {
    name: "Handcrafted Furniture",
    percent: 18,
    amount: 23121,
    color: "#8b5cf6",
  },
  {
    name: "Organic Textiles & Apparel",
    percent: 12,
    amount: 15414,
    color: "#c4b5fd",
  },
];

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function TopSelling({ categories = DEFAULT_CATEGORIES, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Catalog Performance
          </p>
          <h2 className="m-0 mt-1 text-lg font-bold text-slate-900">
            Top Selling Categories
          </h2>
        </div>
        <MdDonutLarge className="mt-1 text-xl text-slate-500" />
      </div>

      <ul className="m-0 mt-6 flex list-none flex-col gap-5 p-0">
        {categories.map((c) => (
          <li key={c.name}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-800">{c.name}</span>
              <span className="shrink-0 font-bold text-slate-900">
                {c.percent}%{" "}
                <span className="font-normal text-slate-600">
                  ({money(c.amount)})
                </span>
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${c.percent}%`, backgroundColor: c.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopSelling;
