import { Checkbox, Input, InputNumber, Slider } from "antd";
import {
  MdCheckCircleOutline,
  MdRefresh,
  MdSearch,
  MdWorkspacePremium,
} from "react-icons/md";
import {
  CATEGORIES,
  DEFAULT_FILTERS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_PRESETS,
} from "../utils/constant";

function FilterSidebar({ filters, onChange }) {
  const { keyword, category, minPrice, maxPrice, inStock } = filters;

  const handleSlider = ([min, max]) =>
    onChange({ minPrice: min, maxPrice: max });
  const handlePreset = (p) => onChange({ minPrice: p.min, maxPrice: p.max });
  const handleReset = () => onChange(DEFAULT_FILTERS);

  return (
    <aside className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <section>
        <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Keywords
        </p>
        <Input
          allowClear
          size="large"
          variant="filled"
          placeholder="Filter items..."
          value={keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          prefix={<MdSearch className="text-lg text-slate-500" />}
          className="mt-2 bg-indigo-50!"
        />
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-lg font-semibold text-slate-900">
            Categories
          </h3>
          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
            {CATEGORIES.length}
          </span>
        </div>

        <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
          {CATEGORIES.map((c) => {
            const active = category === c.value;
            return (
              <li key={c.value}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ category: active ? null : c.value })
                  }
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    active
                      ? "bg-indigo-100 font-semibold text-indigo-700"
                      : "text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {active && <MdCheckCircleOutline className="text-base" />}
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-lg font-semibold text-slate-900">
            Price Scope
          </h3>
          <span className="text-[10px] font-bold text-indigo-700">PKR</span>
        </div>

        <Slider
          range
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={[minPrice, maxPrice]}
          onChange={handleSlider}
          tooltip={{ formatter: (v) => `Rs ${v}` }}
          styles={{
            track: { background: "#4338ca" },
            rail: { background: "#c7d2fe" },
          }}
          className="mx-1! mb-1! mt-4!"
        />

        <div className="flex justify-between text-[11px] font-medium text-slate-600">
          <span>{PRICE_MIN}</span>
          <span>{PRICE_MAX}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <InputNumber
            min={PRICE_MIN}
            max={maxPrice}
            controls={false}
            variant="filled"
            prefix="Rs"
            value={minPrice}
            onChange={(v) => onChange({ minPrice: v ?? PRICE_MIN })}
            className="w-full! bg-indigo-50!"
          />
          <span className="h-px w-4 shrink-0 bg-slate-300" />
          <InputNumber
            min={minPrice}
            max={PRICE_MAX}
            controls={false}
            variant="filled"
            prefix="Rs"
            value={maxPrice}
            onChange={(v) => onChange({ maxPrice: v ?? PRICE_MAX })}
            className="w-full! bg-indigo-50!"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((p) => {
            const active = minPrice === p.min && maxPrice === p.max;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p)}
                className={`cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-50 text-slate-700 hover:bg-indigo-100"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <h3 className="m-0 text-lg font-semibold text-slate-900">
          Stock Status
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <Checkbox
            checked={inStock}
            onChange={(e) => onChange({ inStock: e.target.checked })}
            className="text-xs text-slate-700 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-indigo-700! [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-indigo-700!"
          >
            In Stock
          </Checkbox>
        </div>
      </section>

      <button
        type="button"
        onClick={handleReset}
        className="mt-7 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
      >
        <MdRefresh className="text-base" />
        Reset All Filters
      </button>

      <div className="mt-5 rounded-xl bg-indigo-50/70 p-4">
        <p className="m-0 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
          <MdWorkspacePremium className="text-base" />
          Aura Atelier Grade
        </p>
        <p className="m-0 mt-2 text-[11px] leading-relaxed text-slate-600">
          Every creator undergoes verified craft audits and insured packaging
          protocol.
        </p>
      </div>
    </aside>
  );
}

export default FilterSidebar;
