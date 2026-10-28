import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, App as AntdApp, theme } from "antd";

import {
  useSellerProducts,
  useDeleteSellerProduct,
  useBulkDeleteSellerProducts,
  useSellerProductStats,
} from "../hooks/useSellerProducts";

import UpdateStockModal from "../components/updateStockModal";
import DeleteConfirmationModal from "../components/deleteConfirmationModal";
import SellerProductFilters from "../components/sellerProductFilters";
import SellerProductPagination from "../components/sellerPagination";
import ProductDetailCard from "../components/productDetailCard";

import SellerProductsHeader from "../components/sellerProductsHeader";
import SellerProductsStats from "../components/sellerProductsStats";
import SellerProductsList from "../components/sellerProductsList";

function SellerProducts() {
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const { token } = theme.useToken();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "newest",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } = useSellerProducts(filters);
  const products = data?.products || [];
  const total = data?.pagination?.total || 0;

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSellerProductStats();

  const { mutate: deleteProduct, isPending: isDeleting } =
    useDeleteSellerProduct();

  const { mutate: bulkDeleteProducts, isPending: isBulkDeleting } =
    useBulkDeleteSellerProducts();

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const detailProduct =
    products.find((product) => product._id === detailId) || null;

  const toggleDetail = (product) => {
    setDetailId((current) => (current === product._id ? null : product._id));
  };

  const closeDetail = () => setDetailId(null);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    deleteProduct(productToDelete._id, {
      onSuccess: () => {
        notification.success({
          title: "Product deleted",
          description: `"${productToDelete.name}" was removed from your catalog.`,
          placement: "bottomRight",
        });

        if (detailId === productToDelete._id) closeDetail();
        closeDeleteModal();
      },
      onError: (err) => {
        notification.error({
          title: "Could not delete product",
          description:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete product.",
          placement: "bottomRight",
        });
      },
    });
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const handleProductSelection = (productId, checked) => {
    setSelectedProductIds((current) =>
      checked
        ? current.includes(productId)
          ? current
          : [...current, productId]
        : current.filter((id) => id !== productId),
    );
  };

  const confirmBulkDelete = () => {
    if (selectedProductIds.length === 0 || selectedProductIds.length > 100) {
      return;
    }

    bulkDeleteProducts(selectedProductIds, {
      onSuccess: () => {
        notification.success({
          title: "Products deleted",
          description: `${selectedProductIds.length} products were removed from your catalog.`,
          placement: "bottomRight",
        });

        if (selectedProductIds.includes(detailId)) {
          closeDetail();
        }

        setSelectedProductIds([]);
        setBulkDeleteModalOpen(false);
      },
      onError: (err) => {
        notification.error({
          title: "Bulk delete failed",
          description:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete selected products.",
          placement: "bottomRight",
        });
      },
    });
  };

  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
    setStockModalOpen(true);
  };

  const handleCloseStockModal = () => {
    setStockModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-4 p-4 sm:p-8 md:gap-6">
      <SellerProductsHeader onAdd={() => navigate("/seller/products/new")} />

      <SellerProductsStats
        stats={stats}
        isLoading={isStatsLoading}
        isError={isStatsError}
      />

      <Button
        danger
        block
        disabled={selectedProductIds.length === 0 || isBulkDeleting}
        onClick={() => setBulkDeleteModalOpen(true)}
        className="h-10 rounded-xl px-4 text-xs font-semibold md:text-sm"
      >
        Bulk Delete ({selectedProductIds.length})
      </Button>

      <SellerProductFilters filters={filters} onChange={handleFiltersChange} />

      <div className="flex w-full min-w-0 flex-col gap-4">
        <SellerProductsList
          products={products}
          isLoading={isLoading}
          isError={isError}
          selectedProductIds={selectedProductIds}
          isBulkDeleting={isBulkDeleting}
          detailId={detailId}
          onToggleDetail={toggleDetail}
          onSelectionChange={handleProductSelection}
          token={token}
        />

        <SellerProductPagination
          page={filters.page}
          limit={filters.limit}
          total={total}
          onChange={(page, limit) =>
            setFilters((prev) => ({ ...prev, page, limit }))
          }
        />

        <ProductDetailCard
          product={detailProduct}
          onClose={closeDetail}
          onEdit={(product) => navigate(`/seller/products/edit/${product._id}`)}
          onUpdateStock={handleOpenStockModal}
          onDelete={openDeleteModal}
        />
      </div>

      <UpdateStockModal
        open={stockModalOpen}
        onClose={handleCloseStockModal}
        product={selectedProduct}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete product?"
        confirmText="Delete"
        description={`"${productToDelete?.name ?? ""}" will be permanently removed. This action cannot be undone.`}
      />

      <DeleteConfirmationModal
        open={bulkDeleteModalOpen}
        onCancel={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        loading={isBulkDeleting}
        title="Delete selected products?"
        confirmText="Delete selected"
        description={`You are about to permanently delete ${selectedProductIds.length} products. This action cannot be undone.`}
      />
    </div>
  );
}

export default SellerProducts;
