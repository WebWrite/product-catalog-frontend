import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  ThunderboltFilled,
  StarFilled,
} from "@ant-design/icons";
import { Tag } from "antd";

function ProductCard({
  id = 1,
  title = "Wireless Headphones",
  description = "40-hour battery, deep bass and soft ear cushions.",
  category = "Electronics",
  image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  price = 79,
  oldPrice = 129,
  rating = 4.5,
  reviews = 128,
  onAddToCart,
  onBuyNow,
}) {
  const [liked, setLiked] = useState(false);

  const discount =
    oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className="theme-card group w-72 overflow-hidden rounded-xl border shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="theme-media relative overflow-hidden">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={title}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2 pt-1 pb-0.5 text-xs text-center font-semibold font-sans  text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => setLiked(!liked)}
          className={`theme-control absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-sm shadow transition hover:scale-110 ${
            liked ? "text-rose-600" : "text-gray-700"
          }`}
        >
          {liked ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      <div className="flex flex-col gap-1 py-2 px-2">
        <div className="flex justify-between">
          <Tag variant="filled" className="bg-blue-500! text-white! w-fit">
            {category}
          </Tag>

          <div className="theme-muted flex items-center gap-1 text-xs font-raleway">
            <StarFilled className="text-amber-400!" />
            <span className="theme-heading font-semibold">{rating}</span>
            <span>({reviews})</span>
          </div>
        </div>
        <Link
          to={`/products/${id}`}
          className="theme-heading truncate font-raleway text-lg font-bold hover:text-blue-600"
        >
          {title}
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="theme-heading text-xl font-extrabold font-raleway">
            ${price}
          </span>
          {discount > 0 && (
            <span className="text-sm font-raleway text-gray-400 line-through">
              ${oldPrice}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pb-4 font-raleway">
        <button
          onClick={() => onAddToCart?.(id)}
          className="theme-outline-button flex items-center justify-center gap-2 rounded-xl border-2 py-1.5 text-xs font-semibold transition"
        >
          <ShoppingCartOutlined /> Add to cart
        </button>
        <button
          onClick={() => onBuyNow?.(id)}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-blue-600 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <ThunderboltFilled /> Buy now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
