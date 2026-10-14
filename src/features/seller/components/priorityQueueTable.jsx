import { Button, Tag, Checkbox, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { MdInventory2 } from "react-icons/md";
import { useSellerProducts } from "../hooks/useSellerProducts";

function PriorityQueueTable() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError } = useSellerProducts();

  const handleCardClick = () => {
    navigate("/seller/products");
  };

  return (
    <div
      className="rounded-2xl border border-slate-800 shadow-sm overflow-hidden mt-2 w-full min-w-0"
      style={{ background: "#1E293B" }}
    >
      <div className="p-4 md:p-6 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap min-w-0">
          <h3 className="m-0 font-bold text-sm md:text-base lg:text-lg text-slate-100">
            Cataloged Products
          </h3>
          <Tag
            className="m-0 border-0 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-900/30 text-indigo-400 uppercase tracking-wider"
          >
            {products?.length || 0} Items
          </Tag>
        </div>
        <Button
          size="small"
          type="text"
          className="text-[11px] md:text-[12px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 px-3"
          onClick={() => navigate("/seller/products")}
        >
          View All →
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3 p-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 1 }} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center text-slate-500 text-sm">
          Failed to load products.
        </div>
      )}

      {!isLoading && !isError && (!products || products.length === 0) && (
        <div className="p-6 text-center text-slate-500 text-sm">
          No products yet.
        </div>
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div
          className="flex flex-col overflow-y-auto"
          style={{ maxHeight: 320 }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="p-3 md:p-4 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={handleCardClick}
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    className="product-checkbox"
                    onChange={() => handleCardClick()}
                  />
                </div>

            
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-600">
                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <span className="text-[13px] md:text-sm font-bold text-slate-100 line-clamp-1 capitalize">
                    {product.name}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-slate-500 line-clamp-1">
                    {product.category}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <MdInventory2 size={12} />
                    Stock: {product.stock}
                  </span>
                </div>

              
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[14px] md:text-[16px] font-bold text-slate-100">
                    ${product.price}
                  </span>
                  <Tag
                    className={`m-0 border-0 text-[9px] md:text-[10px] font-bold px-1.5 py-0 rounded-md ${
                      product.status === "active"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {product.status}
                  </Tag>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}

export default PriorityQueueTable;