import { Pagination } from "antd";

const SellerProductPagination = ({
  page,
  limit,
  total,
  onChange,
}) => {
  if (total === 0) return null;

  return (
    <div className="flex justify-center pt-6">
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        onChange={onChange}
        showSizeChanger
        pageSizeOptions={[10, 20, 30, 50]}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} products`
        }
      />
    </div>
  );
};

export default SellerProductPagination;