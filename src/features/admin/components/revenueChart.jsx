import {
  Area,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "../../../shared/utils/currency";

const DEFAULT_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const revenue = 2000 + day * 230 + Math.sin(day / 3) * 700;
  const orders = 30 + day * 2.2 + Math.cos(day * 1.3) * 18;
  return {
    date: `2026-10-${String(day).padStart(2, "0")}`,
    day,
    revenue: Math.round(revenue),
    orders: Math.round(orders),
  };
});

const DEFAULT_STATS = [
  {
    label: "Peak Day Volume",
    value: money(8420.0),
    note: "Oct 29 - 114 Orders",
  },
  {
    label: "Average Order Value",
    value: money(69.73),
    note: "+4.8% improvement",
    highlight: true,
  },
  {
    label: "Marketplace Take-Rate",
    value: "8.5% Net",
    note: "$10,918.25 Rev Share",
  },
];

const HIGHLIGHT_DAYS = [12, 27, 30];

const formatDate = (date) => {
  if (!date) return "";
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, day, revenue, orders } = payload[0].payload;

  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-slate-100">
      <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {date ? formatDate(date) : `Day ${day}`}
      </p>
      <p className="m-0 mt-1 text-sm font-bold text-slate-900">
        {money(revenue)}
      </p>
      <p className="m-0 text-[11px] text-indigo-700">{orders} orders</p>
    </div>
  );
}

function HighlightDot({ cx, cy, payload }) {
  if (!HIGHLIGHT_DAYS.includes(payload.day)) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#ffffff"
      stroke="#3730a3"
      strokeWidth={2}
    />
  );
}

function RevenueChart({
  data = DEFAULT_DATA,
  stats = DEFAULT_STATS,
  className = "",
  isLoading = false,
}) {
  const chartStats =
    stats === DEFAULT_STATS && data.length > 0
      ? [
          {
            label: "Peak Day Volume",
            value: money(Math.max(...data.map((item) => item.revenue))),
            note: `${Math.max(...data.map((item) => item.orders))} orders`,
          },
          {
            label: "Average Order Value",
            value: money(
              data.reduce((total, item) => total + item.revenue, 0) /
                Math.max(
                  data.reduce((total, item) => total + item.orders, 0),
                  1,
                ),
            ),
            note: "Based on loaded revenue",
          },
          {
            label: "Total Orders",
            value: data.reduce((total, item) => total + item.orders, 0),
            note: `${data.length} days`,
          },
        ]
      : stats;
  const chartTicks =
    data.length <= 6
      ? data.map((item) => item.date)
      : data.filter((_, index) => index % Math.ceil(data.length / 6) === 0)
          .map((item) => item.date);

  return (
    <section
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6 ${className}`}
    >
      <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Gross Sales vs Order Velocity
      </p>
      <h2 className="m-0 mt-1 text-xl font-bold text-slate-900">
        Revenue &amp; Volume Graph
      </h2>

      {isLoading ? (
        <div className="mt-6 flex h-64 items-center justify-center text-sm text-slate-500">
          Loading revenue...
        </div>
      ) : (
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6d4aff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6d4aff" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <YAxis yAxisId="revenue" hide domain={[0, "dataMax + 800"]} />
              <YAxis yAxisId="orders" hide domain={[0, "dataMax + 40"]} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
                isAnimationActive={false}
              />

              <XAxis
                dataKey="date"
                ticks={chartTicks}
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fontSize: 10, fill: "#334155", fontWeight: 500 }}
                padding={{ left: 10, right: 20 }}
              />

              <Bar
                yAxisId="orders"
                dataKey="orders"
                fill="#d9ccff"
                barSize={6}
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
              />

              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#3730a3"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={<HighlightDot />}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-indigo-50/70 p-4 sm:grid-cols-3">
        {chartStats.map((s) => (
          <div key={s.label}>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {s.label}
            </p>
            <p className="m-0 mt-1 text-xl font-bold text-slate-900">
              {s.value}
            </p>
            <p
              className={`m-0 mt-0.5 text-[11px] ${
                s.highlight ? "font-semibold text-indigo-700" : "text-slate-500"
              }`}
            >
              {s.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RevenueChart;
