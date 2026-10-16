import { Skeleton } from "antd";

function ProductSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
      <Skeleton.Image active className="h-96! w-full!" />
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );
}

export default ProductSkeleton;
