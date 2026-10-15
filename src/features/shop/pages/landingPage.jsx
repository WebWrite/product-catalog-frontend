import { Link } from "react-router-dom";
import {
  MdArrowForward,
  MdChevronRight,
  MdNorthEast,
  MdStar,
} from "react-icons/md";
import CategoryCard from "../../../shared/components/categoryCard";
import { useState } from "react";
import ProductCard from "../../../shared/components/product";
import CustomCard from "../../../shared/components/customCard";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { FaRotateLeft } from "react-icons/fa6";
import { RiLeafLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/api";
import { money } from "../../../shared/utils/currency";
import { getBadge } from "../utils/constant";

const benefitCard = [
  {
    id: "verified-independent",
    icon: <IoShieldCheckmarkSharp />,
    title: "Verified Independent",
    description:
      "Every maker passes our rigorous quality & trade verification audit.",
  },
  {
    id: "secure-stripe-escrow",
    icon: <CiLock />,
    title: "Secure Stripe Escrow",
    description:
      "Funds held securely in escrow until order delivery is verified.",
  },
  {
    id: "transparent-returns",
    icon: <FaRotateLeft />,
    title: "30-Day Transparent Returns",
    description: "No-hassle returns and insured return labels worldwide.",
  },
  {
    id: "carbon-neutral-delivery",
    icon: <RiLeafLine />,
    title: "Carbon-Neutral Delivery",
    description:
      "100% freight emissions compensated via verified climate credits.",
  },
];

const STATS = [
  { value: "2,400+", label: "Verified Makers" },
  { value: "48h", label: "Insured Logistics" },
  { value: "4.9", label: "Customer Rating", star: true },
];

const featured = {
  name: "Nordic Ceramic Vase",
  price: "$68.00",
  batch: "Batch No. 04 — In Stock",
  image:
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=90",
  to: "/shop/nordic-ceramic-vase",
};

const departments = [
  {
    slug: "apparel-textiles",
    title: "Apparel & Textiles",
    subtitle: "Natural fibers",
    itemCount: "420+",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "audio-electronics",
    title: "Audio & Electronics",
    subtitle: "Precision gear",
    itemCount: "180+",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "home-living",
    title: "Home & Living",
    subtitle: "Artisanal ceramics",
    itemCount: "350+",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "accessories",
    title: "Accessories",
    subtitle: "Full-grain craft",
    itemCount: "210+",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "clean-wellness",
    title: "Clean Wellness",
    subtitle: "Botanical formulas",
    itemCount: "140+",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "studio-workspace",
    title: "Studio & Workspace",
    subtitle: "Desk companions",
    itemCount: "95+",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
];

function LandingPage() {
  const [active, setActive] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = data?.data.products ?? [];

  const filters = [
    { value: "all", label: "All Featured" },
    ...[...new Set(products.map((p) => p.category).filter(Boolean))].map(
      (c) => ({ value: c, label: c }),
    ),
  ];

  const visible =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="landing-page min-h-screen font-sans">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm ring-1 ring-slate-100">
            <span className="size-1.5 rounded-full bg-indigo-600" />
            The 2026 Spring Curation
          </span>

          <h1 className="theme-heading mt-5 text-4xl font-bold leading-tight sm:text-5xl">
            Discover Your Next Favorite.
          </h1>

          <p className="theme-muted mt-5 max-w-md text-sm leading-relaxed">
            Discover quality products from trusted sellers and brands. Explore
            diverse collections, find your favorites, and shop with confidence
            all in one place.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="flex h-10 items-center gap-2 rounded-lg bg-indigo-700! px-5 text-xs font-semibold text-white! transition-colors hover:bg-indigo-800"
            >
              Explore Products <MdArrowForward className="text-base" />
            </Link>
            <Link
              to="/categories"
              className="flex h-10 items-center rounded-lg bg-white px-5 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100 transition-colors hover:bg-indigo-50"
            >
              Browse Categories
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="theme-heading m-0 flex items-center gap-1 text-base font-bold">
                  {s.value}
                  {s.star && <MdStar className="text-sm text-amber-600" />}
                </p>
                <p className="theme-muted m-0 mt-0.5 text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-indigo-100">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90"
            alt="Curated living room"
            className="aspect-4/3 w-full object-cover"
          />

          <div className="absolute right-4 top-4 rounded-xl bg-white/95 px-4 py-2.5 shadow-md backdrop-blur">
            <p className="m-0 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              <span className="size-1.5 rounded-full bg-indigo-600" />
              Trending Now
            </p>
            <p className="m-0 mt-0.5 text-xs font-semibold text-slate-900">
              Sourced from Trusted Sellers
            </p>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl bg-white/95 p-2.5 pr-3 shadow-md backdrop-blur">
            <img
              src={featured.image}
              alt={featured.name}
              className="size-12 rounded-lg bg-slate-100 object-cover"
            />
            <div className="pr-4">
              <p className="m-0 text-[11px] text-slate-500">{featured.name}</p>
              <p className="m-0 text-base font-bold leading-tight text-slate-900">
                {featured.price}
              </p>
              <p className="m-0 text-[10px] font-medium text-indigo-600">
                {featured.batch}
              </p>
            </div>
            <Link
              to={featured.to}
              aria-label={`View ${featured.name}`}
              className="flex size-8 items-center justify-center rounded-lg bg-indigo-700 text-white! transition-colors hover:bg-indigo-800"
            >
              <MdNorthEast />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              Browse Ecosystem
            </p>
            <h2 className="theme-heading m-0 mt-1 text-2xl font-semibold">
              Shop by Curated Department
            </h2>
          </div>

          <Link
            to="/categories"
            className="flex shrink-0 items-center text-xs font-semibold text-indigo-700 hover:underline"
          >
            View All Categories <MdChevronRight className="text-base" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {departments.map((d) => (
            <CategoryCard
              key={d.slug}
              to={`/shop?category=${d.slug}`}
              image={d.image}
              title={d.title}
              subtitle={d.subtitle}
              itemCount={d.itemCount}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              Handpicked Catalog
            </p>
            <h2 className="theme-heading m-0 mt-1 text-2xl font-semibold">
              Featured Curations
            </h2>
            <p className="theme-muted m-0 mt-1 text-xs">
              Sourced from vetted artisan studios and certified independent
              workshops.
            </p>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActive(f.value)}
                  className={`cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                    active === f.value
                      ? "bg-indigo-700 text-white"
                      : "text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="theme-muted py-16 text-center text-sm">
            Loading products...
          </p>
        )}

        {isError && (
          <p className="py-16 text-center text-sm text-red-600">
            Failed to load products. Please try again.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard
                key={p._id}
                id={p._id}
                to={`/shop/${p._id}`}
                image={p.image?.url}
                name={p.name}
                brand={p.seller?.storeName || p.sellerId?.name}
                price={money(p.price)}
                badge={getBadge(p)}
                rating={5}
                reviews={15}
                sizes={p.sizes}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && visible.length === 0 && (
          <p className="theme-muted py-16 text-center text-sm">
            No products in this collection yet.
          </p>
        )}
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefitCard.map((item) => (
          <CustomCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            desc={item.description}
          />
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-br from-indigo-50 via-white to-purple-50 px-6 py-14 text-center shadow-xl shadow-indigo-100 ring-1 ring-indigo-100 sm:px-10">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Curated Dispatch
          </p>

          <h2 className="theme-heading m-0 mt-3 text-3xl font-bold sm:text-4xl">
            Early Access to Limited Drops
          </h2>

          <p className="theme-muted mx-auto mt-4 max-w-md text-sm leading-relaxed">
            Receive weekly stories from artisan studios, private collection
            presales, and thoughtful curation guides.
          </p>

          <form className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-slate-100">
            <input
              type="email"
              placeholder="Enter your email address..."
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="h-9 shrink-0 cursor-pointer rounded-lg bg-indigo-700 px-5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>

          <p className="theme-muted m-0 mt-3 text-[11px]">
            Zero spam. Unsubscribe anytime with a single click.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
