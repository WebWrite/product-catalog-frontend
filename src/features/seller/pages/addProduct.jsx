
import { useNavigate } from "react-router-dom";
import { App as AntdApp } from "antd";

import { useCreateSellerProduct } from "../hooks/useSellerProducts";
import ProductForm from "../components/ProductForm";


function AddProduct() {
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const { mutate: createProduct, isPending } = useCreateSellerProduct();

  const handleSubmit = (payload) => {
    createProduct(payload, {
      onSuccess: () => {
        notification.success({
          title: "Product added",
          description: `"${payload.name}" was added to your catalog.`,
          placement: "bottomRight",
        });

        navigate("/seller/products");
      },
      onError: (err) => {
        notification.error({
          title: "Could not add product",
          description:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add product.",
          placement: "bottomRight",
        });
      },
    });
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}

export default AddProduct;
