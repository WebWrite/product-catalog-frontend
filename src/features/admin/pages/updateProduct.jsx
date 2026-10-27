import { useParams, useNavigate } from "react-router-dom";
import { App as AntdApp, Button, Skeleton } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductForm from "../../seller/components/productForm";
import { getAdminProductById, updateAdminProduct } from "../api/api";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const queryClient = useQueryClient();
  const productQuery = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => getAdminProductById(productId),
    enabled: !!productId,
  });
  const updateMutation = useMutation({
    mutationFn: (payload) => updateAdminProduct(productId, payload),
    onSuccess: (product) => {
      queryClient.setQueryData(["admin", "product", productId], product);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "products", "summary"],
      });
      notification.success({
        title: "Product updated",
        description: `"${product.name}" was updated successfully.`,
        placement: "bottomRight",
      });
      navigate("/admin/products");
    },
    onError: (error) => {
      notification.error({
        title: "Could not update product",
        description:
          error?.response?.data?.message ??
          error?.message ??
          "Failed to update product.",
        placement: "bottomRight",
      });
    },
  });

  if (productQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4">
        <p className="text-red-400">Failed to load the product.</p>
        <Button onClick={() => navigate("/admin/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      product={productQuery.data}
      onSubmit={(payload) => updateMutation.mutate(payload)}
      isPending={updateMutation.isPending}
    />
  );
}

export default UpdateProduct;
