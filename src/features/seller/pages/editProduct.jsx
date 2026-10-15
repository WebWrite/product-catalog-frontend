
import { useParams, useNavigate } from "react-router-dom";
import { App as AntdApp, Button, Skeleton } from "antd";

import {
  useSellerProducts,
  useUpdateSellerProduct,
} from "../hooks/useSellerProducts";
import ProductForm from "../components/ProductForm";

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useSellerProducts();

  const { mutate: updateProduct, isPending } =
    useUpdateSellerProduct();

  const product = products.find(
    (item) => item._id === productId,
  );

  const handleSubmit = (payload) => {
    updateProduct(
      { productId, data: payload },
      {
        onSuccess: () => {
          notification.success({
            title: "Product updated",
            description: `"${payload.name}" was updated successfully.`,
            placement: "bottomRight",
          });

          navigate("/seller/products");
        },
        onError: (err) => {
          notification.error({
            title: "Could not update product",
            description:
              err?.response?.data?.message ||
              err?.message ||
              "Failed to update product.",
            placement: "bottomRight",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto w-full p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto w-full p-4">
        <p className="text-red-400">
          Failed to load the product. Please try again.
        </p>
        <Button onClick={() => navigate("/seller/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto w-full p-4">
        <p className="text-slate-400">Product not found.</p>
        <Button onClick={() => navigate("/seller/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}

export default EditProduct;
