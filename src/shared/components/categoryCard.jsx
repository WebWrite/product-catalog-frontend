import { Link } from "react-router-dom";

function CategoryCard({ to, image, title, subtitle, itemCount }) {
  return (
    <Link
      to={to}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {itemCount && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur">
            {itemCount} items
          </span>
        )}
      </div>

      <div className="px-3.5 py-3">
        <h3 className="m-0 truncate text-xs font-semibold text-slate-900">
          {title}
        </h3>
        <p className="m-0 mt-0.5 truncate text-[11px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;
