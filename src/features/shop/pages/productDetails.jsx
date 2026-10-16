import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import {
  MdAdd,
  MdFavorite,
  MdFavoriteBorder,
  MdLocalShipping,
  MdOutlineVerified,
  MdRemove,
  MdStar,
  MdStorefront,
  MdVerified,
} from "react-icons/md";
import { getProducts, getProductsById } from "../api/api";
import { money } from "../../../shared/utils/currency";
import { DEFAULT_FILTERS, getBadge } from "../utils/constant";
import ProductCard from "../../../shared/components/product";
import ProductSkeleton from "../components/productSkeleton";
import ProductNotFound from "../components/productNotFound";
import { useDispatch, useSelector } from "react-redux";
import { useAddToCart } from "../../cart/hooks/useCart";
import { addItem } from "../../../app/store/cart/cart";

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [liked, setLiked] = useState(false);
  let isloogedIn = useSelector((state) => !!state.user?.email);

  let dispatch = useDispatch();
  let addItemMutation = useAddToCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductsById(id),
    enabled: !!id,
  });

  console.log(data);
  const product = data;

  const { data: related } = useQuery({
    queryKey: ["products", "related", product?.category],
    queryFn: () =>
      getProducts({ ...DEFAULT_FILTERS, category: product.category, limit: 5 }),
    enabled: !!product?.category,
  });
  console.log(related);

  if (isLoading) return <ProductSkeleton />;

  if (isError || !product) {
    return <ProductNotFound />;
  }

  const seller = product.seller;
  const sellerName = seller?.storeName || seller?.name;
  //   const sellerLink = `/sellers/${seller?._id ?? ""}`;
  const sellerLink = "/";
  const sizes = product.sizes ?? [];
  const badge = getBadge(product);
  const outOfStock = product.stock === 0;
  const maxQuantity = 25;
  const total = product.price * quantity;

  const relatedProducts = (related?.data?.products ?? [])
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  let handleAddToCart = () => {
    if (isloogedIn) {
      addItemMutation.mutate({ id, quantity: quantity, size: sizes[0] });
    } else {
      dispatch(addItem({ productId: id, size: sizes[0], quantity: quantity }));
    }
  };

  return (
    <div className="min-h-screen bg-purple-50  font-sans">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-square-4/5 overflow-hidden rounded-2xl bg-slate-100 lg:sticky lg:top-24 lg:self-start">
            {product.image?.url ? (
              <img
                src={product.image.url}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No image available
              </div>
            )}
            {badge && (
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                {badge}
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <h1 className="theme-heading m-0 text-xl font-bold leading-snug sm:text-2xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MdStorefront className="text-base text-indigo-700" />
                <span className="font-semibold text-slate-900">
                  {sellerName}
                </span>
                <MdVerified className="text-sm text-indigo-600" />
              </div>
              <Link
                to={sellerLink}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Message Artisan
              </Link>
            </div>

            <p className="m-0 mt-3 flex items-center gap-1.5 text-xs text-slate-600">
              <MdStar className="text-sm text-amber-600" />
              <span className="font-bold text-slate-900">
                {product.rating ?? 5}
              </span>
              <span>({product.reviewCount ?? 0} verified reviews)</span>
            </p>

            <p className="m-0 mt-4 text-3xl font-bold text-slate-900">
              {money(product.price)}
            </p>

            {sizes.length > 0 && (
              <div className="mt-5">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Options
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {sizes.map((size, i) => {
                    const label = typeof size === "string" ? size : size.label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedSize(i)}
                        className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                          i === selectedSize
                            ? "bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600"
                            : "bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-indigo-300"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Quantity
              </p>
              <div className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 p-1 ring-1 ring-indigo-100">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-base shadow-sm hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdRemove />
                </button>
                <span className="w-9 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQuantity}
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-base shadow-sm hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdAdd />
                </button>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              disabled={outOfStock}
              onClick={handleAddToCart}
              className="mt-5 h-11! bg-indigo-700! text-xs! font-semibold! hover:bg-indigo-800!"
            >
              {outOfStock ? "Out of Stock" : `Add to Cart — ${money(total)}`}
            </Button>

            <div className="mt-3 flex gap-3">
              <Link
                to="/checkout"
                className={`flex h-11 flex-1 items-center justify-center rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700! transition-colors hover:bg-indigo-100 ${
                  outOfStock ? "pointer-events-none opacity-60" : ""
                }`}
              >
                Buy Now • Start Checkout
              </Link>
              <button
                type="button"
                aria-label="Toggle favourite"
                onClick={() => setLiked(!liked)}
                className="flex size-11 cursor-pointer items-center justify-center rounded-lg bg-white text-lg ring-1 ring-slate-200 hover:text-red-500"
              >
                {liked ? (
                  <MdFavorite className="text-red-500" />
                ) : (
                  <MdFavoriteBorder />
                )}
              </button>
            </div>

            <ul className="m-0 mt-5 flex list-none flex-col gap-2.5 rounded-xl bg-indigo-50/60 p-4 text-[11px] text-slate-600">
              <li className="flex items-center gap-2">
                <MdLocalShipping className="shrink-0 text-sm text-indigo-700" />
                {outOfStock
                  ? "Currently out of stock"
                  : "In Stock — Ships within 24 hours from studio"}
              </li>
              <li className="flex items-center gap-2">
                <MdOutlineVerified className="shrink-0 text-sm text-indigo-700" />
                30-Day Frictionless Return with pre-printed dockets
              </li>
              <li className="flex items-center gap-2">
                <MdVerified className="shrink-0 text-sm text-indigo-700" />
                100% Aura protected until delivery inspection
              </li>
            </ul>
          </div>
        </div>

        <section className="mt-12 bg-white rounded-lg px-4 py-6">
          <div className="border-b border-slate-200">
            <span className="inline-block border-b-2 border-indigo-700 pb-2 text-sm font-semibold text-indigo-700">
              Description
            </span>
          </div>
          <h2 className="theme-heading m-0 mt-6 text-xl font-bold">
            {product.name}
          </h2>
          <p className="theme-muted mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed">
            {product.description}
          </p>
        </section>

        <section className="mt-12 flex flex-col gap-4 rounded-2xl bg-violet-100 p-5 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
              {(sellerName || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="m-0 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                {sellerName}
                <MdVerified className="text-sm text-indigo-600" />
              </p>
              <p className="m-0 mt-1 text-[11px] text-slate-500">
                Verified Seller
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to={sellerLink}
              className="flex h-10 items-center rounded-lg bg-white! px-5 text-xs font-semibold text-slate-800! ring-1 ring-slate-200 hover:bg-indigo-50"
            >
              Contact Studio
            </Link>
            <Link
              to={sellerLink}
              className="flex h-10 items-center rounded-lg bg-indigo-700! px-5 text-xs font-semibold text-white! hover:bg-indigo-800!"
            >
              Visit Studio Store
            </Link>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              Complete the ritual
            </p>
            <h2 className="theme-heading m-0 mt-1 text-2xl font-semibold">
              Frequently Curated Together
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relatedProducts.map((p) => (
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
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
