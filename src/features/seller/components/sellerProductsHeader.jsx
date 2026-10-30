import { Button } from "antd";
import { MdAdd } from "react-icons/md";

function SellerProductsHeader({ onAdd }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div className="min-w-0">
        <h1 className="m-0 text-[22px] font-bold tracking-tight text-slate-100 md:text-[26px] lg:text-[30px]">
          Studio Wares &amp; Catalog
        </h1>
        <p className="mt-1 max-w-2xl text-xs font-medium text-slate-400 md:text-sm">
          Manage your product listings, prices, and inventory.
        </p>
      </div>

      <Button
        type="primary"
        icon={<MdAdd />}
        className="h-10 shrink-0 rounded-xl bg-indigo-600 px-4 text-xs font-semibold hover:bg-indigo-700 md:text-sm"
        onClick={onAdd}
      >
        Add New Product
      </Button>
    </div>
  );
}

export default SellerProductsHeader;
