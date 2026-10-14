import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineShoppingBag,
  MdStar,
  MdVerified,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAddToCart } from "../../features/cart/hooks/useCart";
import { addItem } from "../../app/store/cart/cart";

function ProductCard({
  id,
  to,
  image,
  name,
  brand,
  rating,
  reviews,
  price,
  oldPrice,
  badge,
  sizes,
}) {
  const [liked, setLiked] = useState(false);

  let isloogedIn = useSelector((state) => !!state.user?.email);

  let dispatch = useDispatch();
  let addItemMutation = useAddToCart();
  let onAddToCart = () => {
    if (isloogedIn) {
      addItemMutation.mutate({ id, quantity: 1, size: sizes[0] });
    } else {
      dispatch(addItem({ productId: id, size: sizes[0], quantity: 1 }));
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-7/6 overflow-hidden bg-slate-100">
        <Link to={to} className="block h-full w-full">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">
            {badge}
          </span>
        )}

        <button
          type="button"
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-2.5 top-2.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-sm text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-red-500"
        >
          {liked ? (
            <MdFavorite className="text-red-500" />
          ) : (
            <MdFavoriteBorder />
          )}
        </button>
      </div>

      <div className="px-3.5 pb-3.5 pt-3">
        <p className="m-0 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          {brand}
          <MdVerified className="text-xs text-indigo-600" />
        </p>

        <Link to={to}>
          <h3 className="m-0 mt-1 truncate text-sm font-semibold text-slate-900">
            {name}
          </h3>
        </Link>

        <p className="m-0 mt-1 flex items-center gap-1 text-[11px] text-slate-500">
          <MdStar className="text-xs text-amber-600" />
          <span className="font-semibold text-slate-800">{rating}</span>
          <span>({reviews} reviews)</span>
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="m-0 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900">{price}</span>
            {oldPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                {oldPrice}
              </span>
            )}
          </p>

          <button
            type="button"
            aria-label={`Add ${name} to cart`}
            onClick={onAddToCart}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-indigo-50 text-base text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <MdOutlineShoppingBag />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
